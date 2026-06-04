CREATE TABLE `monitoring_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module` enum('plant','water','plening') NOT NULL,
	`record_id` int NOT NULL,
	`admin_id` int NOT NULL,
	`comment` text NOT NULL,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `monitoring_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `monitoring_comments` ADD CONSTRAINT `monitoring_comments_admin_id_users_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `monitoring_comments_record_idx` ON `monitoring_comments` (`module`,`record_id`);--> statement-breakpoint
CREATE INDEX `monitoring_comments_admin_idx` ON `monitoring_comments` (`admin_id`);