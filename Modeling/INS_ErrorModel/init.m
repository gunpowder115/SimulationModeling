%init inertial sensors errors
gyro_drift_const = deg2rad(0.02)/3600;
accel_zero_offset = 5e-3;
gyro_scale_factor = 5e-5;
accel_scale_factor = 3e-6;
gyro_noise_deviation = deg2rad(0.01)/3600;
accel_noise_deviation = 1e-3;

%init corrector errors
lat_error_deviation = 1.5;
lon_error_deviation = 1.5;
alt_error_deviation = 1.5;
vel_e_error_deviation = 0.01;
vel_n_error_deviation = 0.01;
vel_h_error_deviation = 0.01;
