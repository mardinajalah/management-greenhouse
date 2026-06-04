CREATE TABLE `plant_conditions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`record_date` date NOT NULL,
	`plant_type` varchar(120) NOT NULL,
	`description` text NOT NULL,
	`plant_age` varchar(80) NOT NULL,
	`photo_url` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `plant_conditions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plening_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`plening_date` date NOT NULL,
	`room_number` int NOT NULL,
	`plening_type` enum('sprei_hama','sprei_penyakit','polinasi','wiwil','panen') NOT NULL,
	`plening_status` enum('menunggu','siap','selesai') NOT NULL DEFAULT 'menunggu',
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `plening_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `water_conditions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`record_date` date NOT NULL,
	`room_number` int NOT NULL,
	`initial_ppm` int NOT NULL,
	`nutrient_ml` decimal(8,2) NOT NULL,
	`final_ppm` int NOT NULL,
	`initial_ph` decimal(4,2) NOT NULL,
	`ph_down_ml` decimal(8,2) NOT NULL,
	`final_ph` decimal(4,2) NOT NULL,
	`water_temperature` decimal(5,2) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `water_conditions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `plant_conditions` ADD CONSTRAINT `plant_conditions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plening_schedules` ADD CONSTRAINT `plening_schedules_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `water_conditions` ADD CONSTRAINT `water_conditions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `plant_conditions_user_id_idx` ON `plant_conditions` (`user_id`);--> statement-breakpoint
CREATE INDEX `plant_conditions_date_idx` ON `plant_conditions` (`record_date`);--> statement-breakpoint
CREATE INDEX `plening_schedules_user_id_idx` ON `plening_schedules` (`user_id`);--> statement-breakpoint
CREATE INDEX `plening_schedules_date_idx` ON `plening_schedules` (`plening_date`);--> statement-breakpoint
CREATE INDEX `plening_schedules_status_idx` ON `plening_schedules` (`plening_status`);--> statement-breakpoint
CREATE INDEX `water_conditions_user_id_idx` ON `water_conditions` (`user_id`);--> statement-breakpoint
CREATE INDEX `water_conditions_date_idx` ON `water_conditions` (`record_date`);