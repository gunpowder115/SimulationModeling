matObj = 0;
lastSimTime = 0;
startTime = cputime;
currentTime = startTime;

addpath 'examples';
addpath 'src';
serverStatus = 0;

% NOTE
% while client not connected to server (or while it connecting),
% data from UDP port (from Simulink) is not usable!

%correct creating WebSocket server
while ~serverStatus
    fprintf('Creating server...\n');
    webSocketServer = EchoServer(5969);
    if webSocketServer.Status == 1
        serverStatus = 1;
    end
end
%correct connection client to server
fprintf('Waitig for client connection...\n');
while isempty(webSocketServer.Connections)
    %wait)))
end

fprintf('Getting client hash code...\n');
clientCode = webSocketServer.Connections(1).HashCode; %get hash of client
fprintf('Client hash code got succesfully\n');

while (1)
    try
        traj_FG_mat = matfile('D:\param_log\x_ideal_fg.mat');
        traj_FG = traj_FG_mat.x_ideal_fg;
        err_INS_mat = matfile('D:\param_log\x_error_ins.mat');
        err_INS = err_INS_mat.x_error_ins;
        traj_SNS_mat = matfile('D:\param_log\x_real_sns.mat');
        traj_SNS = traj_SNS_mat.x_real_sns;
        err_OKF_mat = matfile('D:\param_log\x_error_okf.mat');
        err_OKF = err_OKF_mat.x_error_okf;

        trajDataLength = length(traj_FG(1, :));
        simTime = traj_FG(2, trajDataLength);
        %if unchanging data from .MAT during some time,
        %we consider the MAT-file closed
        if (simTime == lastSimTime)
            currentTime = cputime;
        else
            lastSimTime = simTime;
            currentTime = startTime;
        end
        if (currentTime - startTime >= 30)
            fprintf('Time limit without data, stopping server...\n');
            ME = MException('MyComponent', 'MAT-file closed');
            throw(ME);
        end

        %err_INS(2, trajDataLength)

        sentLatFG = rad2deg(traj_FG(9, trajDataLength));
        sentLonFG = rad2deg(traj_FG(10, trajDataLength));
        sentAltFG = traj_FG(11, trajDataLength) - traj_FG(20, trajDataLength);
        sentLatINS = rad2deg(traj_FG(9, trajDataLength) + err_INS(2, trajDataLength));
        sentLonINS = rad2deg(traj_FG(10, trajDataLength) + err_INS(3, trajDataLength));
        sentAltINS = sentAltFG + err_INS(4, trajDataLength);
        sentLatSNS = rad2deg(traj_SNS(2, trajDataLength));
        sentLonSNS = rad2deg(traj_SNS(3, trajDataLength));
        sentAltSNS = traj_SNS(4, trajDataLength) - traj_FG(20, trajDataLength);
        sentLatOKF = sentLatINS - rad2deg(err_OKF(2, trajDataLength));
        sentLonOKF = sentLonINS - rad2deg(err_OKF(3, trajDataLength));
        sentAltOKF = sentAltINS;

        err_INS(2, trajDataLength)
        %[sentLatFG, sentLatINS]

        sentData = sprintf('%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f', ...
            sentLatFG, sentLonFG, sentAltFG, sentLatINS, sentLonINS, sentAltINS, ...
            sentLatSNS, sentLonSNS, sentAltSNS, sentLatOKF, sentLonOKF, sentAltOKF);

        %cyclic data transmit to client
        fprintf('Sending data to client...\n');
        webSocketServer.sendTo(clientCode, sentData);
        pause(0.5);
    catch
        %close & delete WebSocket server
        webSocketServer.Status;
        webSocketServer.stop;
        delete(webSocketServer);
        clear webSocketServer;
        status = 0;

        break;
    end
end