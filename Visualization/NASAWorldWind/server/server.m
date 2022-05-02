matObj = 0;
lastSimTime = 0;
startTime = cputime;
currentTime = startTime;

addpath 'D:\Installers\Development\github_repo\examples';
addpath 'D:\Installers\Development\github_repo\src';
serverStatus = 0;

% NOTE
% while client not connected to server (or while it connecting),
% data from UDP port (from Simulink) is not usable!

%correct creating WebSocket server
while ~serverStatus
    fprintf('Creating server...\n');
    server = EchoServer(5969);
    if server.Status == 1
        serverStatus = 1;
    end
end
%correct connection client to server
fprintf('Waitig for client connection...\n');
while isempty(server.Connections)
    %wait)))
end

fprintf('Getting client hash code...\n');
clientCode = server.Connections(1).HashCode; %get hash of client
fprintf('Client hash code got succesfully\n');

while (1)
    try
        matObj = matfile('D:\idealTrajMat.mat');
        idealTraj = matObj.idealTrajData;
    
        simTime = idealTraj(2, length(idealTraj));
        %if unchanging data from .MAT during some time,
        %we consider the MAT-file closed
        if (simTime == lastSimTime)
            currentTime = cputime;
        else
            lastSimTime = simTime;
            currentTime = startTime;
        end
        if (currentTime - startTime >= 20)
            ME = MException('MyComponent', 'MAT-file closed');
            throw(ME);
        end

        sentData = [ rad2deg(idealTraj(3, length(idealTraj))), rad2deg(idealTraj(4, length(idealTraj))), idealTraj(5, length(idealTraj))];
        num2str(sentData)
        sentData = sprintf('%f,%f,%f', rad2deg(idealTraj(3, length(idealTraj))), rad2deg(idealTraj(4, length(idealTraj))), idealTraj(5, length(idealTraj)) - idealTraj(6, length(idealTraj)));
        sentData

        %cyclic data transmit to client
        fprintf('Sending data to client...');
        server.sendTo(clientCode, sentData);
        pause(0.5);
    catch
        %close & delete WebSocket server
        server.stop;
        delete(server);
        clear server;
        status = 0;

        break;
    end
end