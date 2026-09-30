CREATE TABLE `annotation` (
	`id` integer PRIMARY KEY,
	`tags` text[],
	`param` jsonb,
	`doc` integer,
	`version` blob,
	`start_pos` integer NOT NULL,
	`end_pos` integer,
	CONSTRAINT `fk_annotation_doc_version_change_set_doc_id_fk` FOREIGN KEY (`doc`,`version`) REFERENCES `change_set`(`doc`,`id`)
) STRICT;

CREATE TABLE `author` (
	`id` integer PRIMARY KEY,
	`name` text NOT NULL,
	`urls` text[]
) STRICT;

CREATE TABLE `change_set` (
	`id` blob PRIMARY KEY,
	`doc` integer,
	`author` text,
	`timestamp` timestamp,
	`message` text,
	`changes` text,
	`parents` blob[],
	CONSTRAINT `fk_change_set_doc_doc_id_fk` FOREIGN KEY (`doc`) REFERENCES `doc`(`id`)
) STRICT;

CREATE TABLE `doc` (
	`id` integer PRIMARY KEY,
	`version` blob,
	`lang` text NOT NULL,
	`book` text,
	`title` text
) STRICT;

CREATE TABLE `doc_credit` (
	`doc` integer NOT NULL,
	`author` integer NOT NULL,
	`credits` text[],
	CONSTRAINT `doc_credit_pk` PRIMARY KEY(`doc`, `author`),
	CONSTRAINT `fk_doc_credit_doc_doc_id_fk` FOREIGN KEY (`doc`) REFERENCES `doc`(`id`),
	CONSTRAINT `fk_doc_credit_author_author_id_fk` FOREIGN KEY (`author`) REFERENCES `author`(`id`)
) STRICT;

CREATE TABLE `foo` (
	`id` integer PRIMARY KEY
) STRICT;

CREATE TABLE `plot` (
	`doc` integer NOT NULL,
	`id` integer NOT NULL,
	`type` text NOT NULL,
	`param` jsonb,
	`marks` jsonb,
	`length` integer,
	`parent` integer,
	`text_content` text,
	`content` jsonb,
	CONSTRAINT `plot_pk` PRIMARY KEY(`doc`, `id`),
	CONSTRAINT `fk_plot_doc_doc_id_fk` FOREIGN KEY (`doc`) REFERENCES `doc`(`id`),
	CONSTRAINT `fk_plot_doc_parent_plot_doc_id_fk` FOREIGN KEY (`doc`,`parent`) REFERENCES `plot`(`doc`,`id`)
) STRICT;

CREATE TABLE `xref` (
	`id` integer PRIMARY KEY,
	`tags` text[],
	`from_doc` integer NOT NULL,
	`from_doc_version` blob NOT NULL,
	`from_doc_start_pos` integer NOT NULL,
	`from_doc_end_pos` integer,
	`to_doc` integer NOT NULL,
	`to_doc_version` blob NOT NULL,
	`to_doc_start_pos` integer NOT NULL,
	`to_doc_end_pos` integer
) STRICT;
