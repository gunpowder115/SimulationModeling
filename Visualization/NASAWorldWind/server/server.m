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
        idealTrajMat = matfile('D:\x_ideal_fg.mat');
        idealTraj = idealTrajMat.x_ideal_fg;
        realTrajMat = matfile('D:\x_real_ins.mat');
        realTraj = realTrajMat.x_real_ins;

        simTime = idealTraj(2, length(idealTraj));
        %if unchanging data from .MAT during some time,
        %we consider the MAT-file closed
        if (simTime == lastSimTime)
            currentTime = cputime;
        else
            lastSimTime = simTime;
            currentTime = startTime;
        end
        if (currentTime - startTime >= 100)
            fprintf('Time limit without data, stopping server...\n');
            ME = MException('MyComponent', 'MAT-file closed');
            throw(ME);
        end

        sentLatIdeal = rad2deg(idealTraj(9, length(idealTraj)));
        sentLonIdeal = rad2deg(idealTraj(10, length(idealTraj)));
        sentAltIdeal = idealTraj(11, length(idealTraj)) - idealTraj(20, length(idealTraj));
        sentLatReal = rad2deg(realTraj(8, length(realTraj)));
        sentLonReal = rad2deg(realTraj(9, length(realTraj)));
        sentAltReal = realTraj(10, length(realTraj)) - idealTraj(20, length(idealTraj));
        sentData = sprintf('%f,%f,%f,%f,%f,%f', sentLatIdeal, sentLonIdeal, sentAltIdeal, sentLatReal, sentLonReal, sentAltReal);
        sentData

        %cyclic data transmit to client
        fprintf('Sending data to client...\n');
        webSocketServer.sendTo(clientCode, sentData);
        %pause(0.5);
        pause(0.5);
    catch
        %close & delete WebSocket server
        webSocketServer.stop;
        delete(webSocketServer);
        clear webSocketServer;
        status = 0;

        break;
    end
end