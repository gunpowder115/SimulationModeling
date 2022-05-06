close all

%open mat-files and extract data
x_ideal_fg_mat = matfile('x_ideal_fg.mat');
x_ideal_fg = x_ideal_fg_mat.x_ideal_fg;
x_real_ins_mat = matfile('x_real_ins.mat');
x_real_ins = x_real_ins_mat.x_real_ins;
%ideal parameters from FG
simTime = x_ideal_fg(2, :); %simulation time from FG
n_v_ideal_fg = x_ideal_fg(3, :);
n_u_ideal_fg = x_ideal_fg(4, :);
n_w_ideal_fg = x_ideal_fg(5, :);
omega_q_ideal_fg = x_ideal_fg(6, :);
omega_p_ideal_fg = x_ideal_fg(7, :);
omega_r_ideal_fg = x_ideal_fg(8, :);
lat_ideal_fg = x_ideal_fg(9, :);
lon_ideal_fg = x_ideal_fg(10, :);
alt_ideal_fg = x_ideal_fg(11, :);
vel_e_ideal_fg = x_ideal_fg(12, :);
vel_n_ideal_fg = x_ideal_fg(13, :);
vel_h_ideal_fg = x_ideal_fg(14, :);
roll_ideal_fg = x_ideal_fg(15, :);
pitch_ideal_fg = x_ideal_fg(16, :);
yaw_ideal_fg = x_ideal_fg(17, :);
alt_baro_ideal_fg = x_ideal_fg(18, :);
vel_h_vario_ideal_fg(19, :);
terrain_elevation = x_ideal_fg(20, :);
%real parameters from INS
n_v_real_ins = x_real_ins(2, :);
n_u_real_ins = x_real_ins(3, :);
n_w_real_ins = x_real_ins(4, :);
omega_q_real_ins = x_real_ins(5, :);
omega_p_real_ins = x_real_ins(6, :);
omega_r_real_ins = x_real_ins(7, :);
lat_real_ins = x_real_ins(8, :);
lon_real_ins = x_real_ins(9, :);
alt_real_ins = x_real_ins(10, :);
vel_e_real_ins = x_real_ins(11, :);
vel_n_real_ins = x_real_ins(12, :);
vel_h_real_ins = x_real_ins(13, :);
roll_real_ins = x_real_ins(14, :);
pitch_real_ins = x_real_ins(15, :);
yaw_real_ins = x_real_ins(16, :);
