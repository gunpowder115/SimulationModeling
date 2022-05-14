close all;

x_kalman_mat = matfile('x_kalman.mat');
x_kalman = x_kalman_mat.x_kalman;
x_hat_kalman_mat = matfile('x_hat_kalman.mat');
x_hat_kalman = x_hat_kalman_mat.x_hat_kalman;
p_kalman_mat = matfile('p_kalman.mat');
p_kalman = p_kalman_mat.p_kalman;

simTime = x_kalman(1, :);

lon_error = x_kalman(2, :);
lat_error = x_kalman(3, :);
vel_E_error = x_kalman(4, :);
vel_N_error = x_kalman(5, :);
alpha_error = x_kalman(6, :);
beta_error = x_kalman(7, :);
gamma_error = x_kalman(8, :);
gyro_drift_error = x_kalman(9, :); %also 10 & 11
gyro_scaleFactor_error = x_kalman(12, :); %also 13 & 14
accel_zeroOffset_error = x_kalman(15, :); %also 16 & 17
accel_scaleFactor_error = x_kalman(18, :); %also 19 & 20

lon_error_hat = x_hat_kalman(2, :);
lat_error_hat = x_hat_kalman(3, :);
vel_E_error_hat = x_hat_kalman(4, :);
vel_N_error_hat = x_hat_kalman(5, :);
alpha_error_hat = x_hat_kalman(6, :);
beta_error_hat = x_hat_kalman(7, :);
gamma_error_hat = x_hat_kalman(8, :);
gyro_drift_error_hat = x_hat_kalman(9, :); %also 10 & 11
gyro_scaleFactor_error_hat = x_hat_kalman(12, :); %also 13 & 14
accel_zeroOffset_error_hat = x_hat_kalman(15, :); %also 16 & 17
accel_scaleFactor_error_hat = x_hat_kalman(18, :); %also 19 & 20

figure;
plot(simTime, lon_error, 'b');
grid on; hold on;
plot(simTime, lon_error_hat, 'r');
title('Долгота ошибка и оценка');

figure;
plot(simTime, lat_error, 'b');
grid on; hold on;
plot(simTime, lat_error_hat, 'r');
title('Широта ошибка и оценка');

figure;
plot(simTime, vel_E_error, 'b');
grid on; hold on;
plot(simTime, vel_E_error_hat, 'r');
title('V_E ошибка и оценка');

figure;
plot(simTime, vel_N_error, 'b');
grid on; hold on;
plot(simTime, vel_N_error_hat, 'r');
title('V_N ошибка и оценка');

figure;
subplot(1, 2, 1);
plot(simTime, lon_error_hat - lon_error, 'b');
grid on; hold on;
title('X1 - X1^');
subplot(1, 2, 2);
plot(simTime, lat_error_hat - lat_error, 'b');
grid on; hold on;
title('X2 - X2^');

figure;
subplot(1, 2, 1);
plot(simTime, vel_E_error_hat - vel_E_error, 'r');
grid on; hold on;
title('X3 - X3^');
subplot(1, 2, 2);
plot(simTime, vel_N_error_hat - vel_N_error, 'r');
grid on; hold on;
title('X4 - X4^');

figure;
subplot(2, 2, 1);
plot(simTime, p_kalman(2, :), 'b');
grid on;
title('Ковариация X1');
subplot(2, 2, 2);
plot(simTime, p_kalman(3, :), 'b');
grid on;
title('Ковариация X2');
subplot(2, 2, 3);
plot(simTime, p_kalman(4, :), 'r');
grid on;
title('Ковариация X3');
subplot(2, 2, 4);
plot(simTime, p_kalman(5, :), 'r');
grid on;
title('Ковариация X1');

% figure;
% plot(simTime, alpha_error, 'b');
% grid on; hold on;
% plot(simTime, alpha_error_hat, 'r');
% title('alpha ошибка и оценка');
% 
% figure;
% plot(simTime, beta_error, 'b');
% grid on; hold on;
% plot(simTime, beta_error_hat, 'r');
% title('beta ошибка и оценка');
% 
% figure;
% plot(simTime, gamma_error, 'b');
% grid on; hold on;
% plot(simTime, gamma_error_hat, 'r');
% title('gamma ошибка и оценка');
% 
% figure;
% plot(simTime, gyro_drift_error, 'b');
% grid on; hold on;
% plot(simTime, gyro_drift_error_hat, 'r');
% title('Дрейф гироскопа ошибка и оценка');
% 
% figure;
% plot(simTime, gyro_scaleFactor_error, 'b');
% grid on; hold on;
% plot(simTime, gyro_scaleFactor_error_hat, 'r');
% title('МК гироскопа ошибка и оценка');
% 
% figure;
% plot(simTime, accel_zeroOffset_error, 'b');
% grid on; hold on;
% plot(simTime, accel_zeroOffset_error_hat, 'r');
% title('Сдвиг 0 акселерометра ошибка и оценка');
% 
% figure;
% plot(simTime, accel_scaleFactor_error, 'b');
% grid on; hold on;
% plot(simTime, accel_scaleFactor_error_hat, 'r');
% title('МК акселерометра ошибка и оценка');