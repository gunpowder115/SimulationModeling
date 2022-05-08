close all

%open mat-files and extract data
x_ideal_fg_mat = matfile('x_ideal_fg.mat');
x_ideal_fg = x_ideal_fg_mat.x_ideal_fg;
x_ideal_ins_mat = matfile('x_ideal_ins.mat');
x_ideal_ins = x_ideal_ins_mat.x_ideal_ins;
x_real_ins_mat = matfile('x_real_ins.mat');
x_real_ins = x_real_ins_mat.x_real_ins;
x_real_sns_mat = matfile('x_real_sns.mat');
x_real_sns = x_real_sns_mat.x_real_sns;
%simulation time from Simulink
simTime = x_ideal_ins(1, :);
%ideal parameters from FG
dataLength = length(x_ideal_ins);
onesDataLength = ones(1, dataLength);
omega_q_ideal_fg = x_ideal_fg(2, 1) .* onesDataLength;
omega_p_ideal_fg = x_ideal_fg(3, 1) .* onesDataLength;
omega_r_ideal_fg = x_ideal_fg(4, 1) .* onesDataLength;
n_v_ideal_fg = x_ideal_fg(5, 1) .* onesDataLength;
n_u_ideal_fg = x_ideal_fg(6, 1) .* onesDataLength;
n_w_ideal_fg = x_ideal_fg(7, 1) .* onesDataLength;
lat_ideal_fg = x_ideal_fg(8, 1) .* onesDataLength;
lon_ideal_fg = x_ideal_fg(9, 1) .* onesDataLength;
alt_ideal_fg = x_ideal_fg(10, 1) .* onesDataLength;
vel_e_ideal_fg = x_ideal_fg(11, 1) .* onesDataLength;
vel_n_ideal_fg = x_ideal_fg(12, 1) .* onesDataLength;
vel_h_ideal_fg = x_ideal_fg(13, 1) .* onesDataLength;
roll_ideal_fg = x_ideal_fg(14, 1) .* onesDataLength;
pitch_ideal_fg = x_ideal_fg(15, 1) .* onesDataLength;
heading_ideal_fg = x_ideal_fg(16, 1) .* onesDataLength;
%ideal parameters from INS
omega_q_ideal_ins = x_ideal_ins(2, :);
omega_p_ideal_ins = x_ideal_ins(3, :);
omega_r_ideal_ins = x_ideal_ins(4, :);
n_v_ideal_ins = x_ideal_ins(5, :);
n_u_ideal_ins = x_ideal_ins(6, :);
n_w_ideal_ins = x_ideal_ins(7, :);
lat_ideal_ins = x_ideal_ins(8, :);
lon_ideal_ins = x_ideal_ins(9, :);
alt_ideal_ins = x_ideal_ins(10, :);
vel_e_ideal_ins = x_ideal_ins(11, :);
vel_n_ideal_ins = x_ideal_ins(12, :);
vel_h_ideal_ins = x_ideal_ins(13, :);
roll_ideal_ins = x_ideal_ins(14, :);
pitch_ideal_ins = x_ideal_ins(15, :);
heading_ideal_ins = x_ideal_ins(16, :);
ro_1_ideal_ins = x_ideal_ins(17, :);
ro_2_ideal_ins = x_ideal_ins(18, :);
%real parameters from INS
omega_q_real_ins = x_real_ins(2, :);
omega_p_real_ins = x_real_ins(3, :);
omega_r_real_ins = x_real_ins(4, :);
n_v_real_ins = x_real_ins(5, :);
n_u_real_ins = x_real_ins(6, :);
n_w_real_ins = x_real_ins(7, :);
lat_real_ins = x_real_ins(8, :);
lon_real_ins = x_real_ins(9, :);
alt_real_ins = x_real_ins(10, :);
vel_e_real_ins = x_real_ins(11, :);
vel_n_real_ins = x_real_ins(12, :);
vel_h_real_ins = x_real_ins(13, :);
roll_real_ins = x_real_ins(14, :);
pitch_real_ins = x_real_ins(15, :);
heading_real_ins = x_real_ins(16, :);
ro_1_real_ins = x_real_ins(17, :);
ro_2_real_ins = x_real_ins(18, :);
%real parameters from SNS
lat_real_sns = x_real_sns(2, :);
lon_real_sns = x_real_sns(3, :);
alt_real_sns = x_real_sns(4, :);
vel_e_real_sns = x_real_sns(5, :);
vel_n_real_sns = x_real_sns(6, :);
vel_h_real_sns = x_real_sns(7, :);

%plotting
% требуемый уход за час полёта: 1 NM = 1' = 1/60 градуса = 0.0167 градуса
%   при номинальных характеристиках датчиков, 
%   уход за час полёта составляет 0.03189 градуса = 1.9 NM
%   при прецизионных характеристиках датчиков, 
%   уход за час полёта составляет 0.00306 градуса = 0.18 NM
%   при грубых характеристиках датчиков, 
%   уход за час полёта составляет 0.3202 градуса = 19.2 NM
lat_ideal_ins_error = (lat_ideal_ins - lat_ideal_fg) .* ro_2_ideal_ins;
lat_real_ins_error = (lat_real_ins - lat_ideal_fg) .* ro_2_real_ins;
lon_ideal_ins_error = (lon_ideal_ins - lon_ideal_fg) .* ro_1_real_ins .* cos(lat_ideal_fg);
lon_real_ins_error = (lon_real_ins - lon_ideal_fg) .* ro_1_real_ins .* cos(lat_real_ins);

vel_e_ideal_ins_error = vel_e_ideal_ins - vel_e_ideal_fg;
vel_e_real_ins_error = vel_e_real_ins - vel_e_ideal_fg;
vel_n_ideal_ins_error = vel_n_ideal_ins - vel_n_ideal_fg;
vel_n_real_ins_error = vel_n_real_ins - vel_n_ideal_fg;

figure;
plot(simTime, lat_ideal_ins_error, 'b');
grid on; hold on;
plot(simTime, lat_real_ins_error, 'r');
title('Ошибки по широте (идеал и реал)');
lat_real_ins_error(length(lat_real_ins_error)) / ro_2_real_ins(length(lat_real_ins_error))

figure;
plot(simTime, rad2deg(lat_ideal_fg), 'b');
grid on; hold on;
plot(simTime, rad2deg(lat_real_ins), 'r');
title('Широта (идеал и реал)');

figure;
plot(simTime, rad2deg(lon_ideal_fg), 'b');
grid on; hold on;
plot(simTime, rad2deg(lon_real_ins), 'r');
title('Долгота (идеал и реал)');

figure;
plot(simTime, lon_ideal_ins_error, 'b');
grid on; hold on;
plot(simTime, lon_real_ins_error, 'r');
title('Ошибки по долготе (идеал и реал)');

figure;
plot(simTime, vel_n_ideal_ins_error, 'b');
grid on; hold on;
plot(simTime, vel_n_real_ins_error, 'r');
title('Ошибки по Vn (идеал и реал)');

lat_real_sns_error = (lat_real_sns - lat_ideal_fg) .* ro_2_ideal_ins;
figure;
plot(simTime, lat_real_sns_error, 'r');
grid on; hold on;
title('СНС ошибка по широте');