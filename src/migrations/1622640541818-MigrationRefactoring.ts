import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationRefactoring1622640541818 implements MigrationInterface {
    name = 'MigrationRefactoring1622640541818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."resource_action" ("id" BIGSERIAL NOT NULL, "role_id" integer, "resource_id" integer, "action" character varying(20), "url" character varying(100), CONSTRAINT "PK_7b9473d5d5000a474591d62b37b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "resource_action_pkey" ON "public"."resource_action" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."resource" ("id" BIGSERIAL NOT NULL, "name" character varying(50), "version" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_user" character varying(254) DEFAULT NULL::character varying, "updated_user" character varying(254) DEFAULT NULL::character varying, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1ad848890c267a182b3b0a913d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "resource_pkey" ON "public"."resource" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."role" ("id" BIGSERIAL NOT NULL, "fullname" character varying(255) DEFAULT NULL::character varying, "name" character varying(255) DEFAULT NULL::character varying, "version" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_user" character varying(254) DEFAULT NULL::character varying, "updated_user" character varying(254) DEFAULT NULL::character varying, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ab841b6a976216a286c10c117f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "role_pkey" ON "public"."role" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."user_role" ("id" BIGSERIAL NOT NULL, "user_id" integer, "role_id" integer, CONSTRAINT "PK_294737c12b5cc236297c8f9f7ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_role_pkey" ON "public"."user_role" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."users" ("id" BIGSERIAL NOT NULL, "confirmation_token" character varying(255) DEFAULT NULL::character varying, "email" character varying(255) DEFAULT NULL::character varying, "enabled" boolean DEFAULT false, "fullname" character varying(255) DEFAULT NULL::character varying, "password" character varying(255) DEFAULT NULL::character varying, "payment_status" integer DEFAULT 0, "contact_person" character varying(255) DEFAULT NULL::character varying, "number_id" character varying(255) DEFAULT NULL::character varying, "phone_number" character varying(255) DEFAULT NULL::character varying, "phone_number_contact" character varying(255) DEFAULT NULL::character varying, "registered_address" character varying(255) DEFAULT NULL::character varying, "tax_code" character varying(255) DEFAULT NULL::character varying, "transaction_address" character varying(255) DEFAULT NULL::character varying, "user_type" integer NOT NULL DEFAULT 0, "type_cargo" character varying(255) DEFAULT NULL::character varying, "token_reset_pass" character varying(255) DEFAULT NULL::character varying, "field_business" character varying(255) DEFAULT NULL::character varying, "field_services" character varying(255) DEFAULT NULL::character varying, "legal_representative" text DEFAULT NULL::character varying, "bank_account_name" character varying(255) DEFAULT NULL::character varying, "bank_account_number" character varying(255) DEFAULT NULL::character varying, "bank_name" character varying(255) DEFAULT NULL::character varying, "version" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_user" character varying(254) DEFAULT NULL::character varying, "updated_user" character varying(254) DEFAULT NULL::character varying, "is_deleted" boolean NOT NULL DEFAULT false, "avatar" character varying(255) DEFAULT NULL::character varying, "carrier_id" integer DEFAULT 0, "driver_license_number" character varying(255) DEFAULT NULL::character varying, "platform" character varying(255) DEFAULT NULL::character varying, "device_token" character varying(255) DEFAULT NULL::character varying, "approve_status" integer NOT NULL DEFAULT 0, "approve_date" TIMESTAMP DEFAULT NULL::timestamp without time zone, "rating_point" double precision(53) DEFAULT 0, "rating_times" integer DEFAULT 0, "payment_method" integer DEFAULT 0, "postpaid_limit" double precision(53) DEFAULT 0, "app_language" character varying(20) DEFAULT 'en', "expiry_date" TIMESTAMP DEFAULT NULL::timestamp without time zone, "account_type" integer NOT NULL DEFAULT 0, "sms_verification_sent" integer DEFAULT 0, "postpaid_available" double precision(53) DEFAULT 0, "auto_accept_job" boolean DEFAULT false, "multiple_account" boolean DEFAULT false, "driving_license_type" integer DEFAULT 1, "sales_code" character varying(50) DEFAULT NULL::character varying, "parent_id" integer, "job_title" character varying(255) DEFAULT NULL::character varying, "pre_approval_account" boolean DEFAULT false, "driving_license_expired_date" TIMESTAMP DEFAULT NULL::timestamp without time zone, "document_expired_date" TIMESTAMP DEFAULT NULL::timestamp without time zone, "registered_address_no" character varying(255) DEFAULT NULL::character varying, "registered_alley" character varying(255) DEFAULT NULL::character varying, "registered_street" character varying(255) DEFAULT NULL::character varying, "registered_district" integer, "registered_province" integer, "registered_postcode" character varying(255) DEFAULT NULL::character varying, "transaction_address_no" character varying(255) DEFAULT NULL::character varying, "transaction_alley" character varying(255) DEFAULT NULL::character varying, "transaction_street" character varying(255) DEFAULT NULL::character varying, "transaction_district" integer, "transaction_province" integer, "transaction_postcode" character varying(255) DEFAULT NULL::character varying, "login_failed_count" integer DEFAULT 0, "is_locked" boolean NOT NULL DEFAULT false, "commission_fee" double precision(53) DEFAULT 0, "registered_sub_district" integer, "transaction_sub_district" integer, "reject_note" character varying(550) DEFAULT NULL::character varying, CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_pkey" ON "public"."users" ("id") `);
        await queryRunner.query(`CREATE VIEW "vw_user_role" AS 
  SELECT ur.id,
    ur.user_id,
    ur.role_id,
    ro.fullname AS role_name
  FROM user_role ur
    LEFT JOIN role ro ON ro.id = ur.role_id;
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","vw_user_role","SELECT ur.id,\n    ur.user_id,\n    ur.role_id,\n    ro.fullname AS role_name\n  FROM user_role ur\n    LEFT JOIN role ro ON ro.id = ur.role_id;"]);
        await queryRunner.query(`CREATE VIEW "vw_user_role_resource" AS 
  SELECT ur.id,
    ur.user_id,
    ur.role_id,
    re.id AS resource_id,
    ra.action,
    ra.url
  FROM user_role ur
    LEFT JOIN role ro ON ro.id = ur.role_id
    LEFT JOIN resource_action ra ON ra.role_id = ur.role_id
    LEFT JOIN resource re ON re.id = ra.resource_id;
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","vw_user_role_resource","SELECT ur.id,\n    ur.user_id,\n    ur.role_id,\n    re.id AS resource_id,\n    ra.action,\n    ra.url\n  FROM user_role ur\n    LEFT JOIN role ro ON ro.id = ur.role_id\n    LEFT JOIN resource_action ra ON ra.role_id = ur.role_id\n    LEFT JOIN resource re ON re.id = ra.resource_id;"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "schema" = $1 AND "name" = $2`, ["public","vw_user_role_resource"]);
        await queryRunner.query(`DROP VIEW "vw_user_role_resource"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "schema" = $1 AND "name" = $2`, ["public","vw_user_role"]);
        await queryRunner.query(`DROP VIEW "vw_user_role"`);
        await queryRunner.query(`DROP INDEX "public"."users_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."users"`);
        await queryRunner.query(`DROP INDEX "public"."user_role_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."user_role"`);
        await queryRunner.query(`DROP INDEX "public"."role_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."role"`);
        await queryRunner.query(`DROP INDEX "public"."resource_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."resource"`);
        await queryRunner.query(`DROP INDEX "public"."resource_action_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."resource_action"`);
    }

}
