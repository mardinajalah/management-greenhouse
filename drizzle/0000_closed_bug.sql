CREATE TABLE `attendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`attendance_date` date NOT NULL,
	`work_title` varchar(160) NOT NULL,
	`work_description` text,
	`check_in_time` time NOT NULL,
	`check_out_time` time,
	`status` enum('sedang_dikerjakan','selesai','izin','sakit','alpha') NOT NULL DEFAULT 'sedang_dikerjakan',
	`note` varchar(255),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `attendances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`monitoring_id` int NOT NULL,
	`admin_id` int NOT NULL,
	`comment` text NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `greenhouse_monitorings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`monitoring_date` date NOT NULL,
	`water_condition` varchar(160) NOT NULL,
	`water_ph` decimal(4,2) NOT NULL,
	`water_temperature` decimal(5,2) NOT NULL,
	`air_temperature` decimal(5,2) NOT NULL,
	`humidity` decimal(5,2) NOT NULL,
	`plant_condition` varchar(180) NOT NULL,
	`pest_condition` varchar(180) NOT NULL,
	`notes` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `greenhouse_monitorings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monitoring_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`monitoring_id` int NOT NULL,
	`photo_url` varchar(255) NOT NULL,
	`caption` varchar(160),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `monitoring_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(180) NOT NULL,
	`username` varchar(80),
	`password_hash` varchar(255) NOT NULL,
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`phone` varchar(40),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_monitoring_id_greenhouse_monitorings_id_fk` FOREIGN KEY (`monitoring_id`) REFERENCES `greenhouse_monitorings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comments` ADD CONSTRAINT `comments_admin_id_users_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `greenhouse_monitorings` ADD CONSTRAINT `greenhouse_monitorings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `monitoring_photos` ADD CONSTRAINT `monitoring_photos_monitoring_id_greenhouse_monitorings_id_fk` FOREIGN KEY (`monitoring_id`) REFERENCES `greenhouse_monitorings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `attendances_user_id_idx` ON `attendances` (`user_id`);--> statement-breakpoint
CREATE INDEX `attendances_date_idx` ON `attendances` (`attendance_date`);--> statement-breakpoint
CREATE INDEX `attendances_status_idx` ON `attendances` (`status`);--> statement-breakpoint
CREATE INDEX `comments_monitoring_id_idx` ON `comments` (`monitoring_id`);--> statement-breakpoint
CREATE INDEX `comments_admin_id_idx` ON `comments` (`admin_id`);--> statement-breakpoint
CREATE INDEX `monitorings_user_id_idx` ON `greenhouse_monitorings` (`user_id`);--> statement-breakpoint
CREATE INDEX `monitorings_date_idx` ON `greenhouse_monitorings` (`monitoring_date`);--> statement-breakpoint
CREATE INDEX `photos_monitoring_id_idx` ON `monitoring_photos` (`monitoring_id`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);