import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationRefactoring1623826797736 implements MigrationInterface {
    name = 'MigrationRefactoring1623826797736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."address" ("id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "phone_number_contact" character varying(20), "address_no" character varying(20), "moo" character varying(3), "soi" character varying(50), "road" character varying(30), "district_province_id" character varying(6), "zip_code" character varying(5), "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_by" character varying(120), "updated_by" character varying(120), CONSTRAINT "PK_3d1e15b90ff2a5f2bfc431c6bdd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."resource_action" ("id" BIGSERIAL NOT NULL, "role_id" integer, "resource_id" integer, "action" character varying(20), "url" character varying(100), CONSTRAINT "PK_7b9473d5d5000a474591d62b37b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "resource_action_pkey" ON "public"."resource_action" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."resource" ("id" BIGSERIAL NOT NULL, "name" character varying(50), "version" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_user" character varying(254) DEFAULT NULL::character varying, "updated_user" character varying(254) DEFAULT NULL::character varying, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_1ad848890c267a182b3b0a913d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "resource_pkey" ON "public"."resource" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."role" ("id" BIGSERIAL NOT NULL, "fullname" character varying(255), "name" character varying(255), "version" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_by" character varying(120), "updated_by" character varying(120), "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ab841b6a976216a286c10c117f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."term_of_service_user" ("id" BIGSERIAL NOT NULL, "term_of_service_id" integer NOT NULL, "user_id" integer NOT NULL, "version" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_user" character varying(254) DEFAULT NULL::character varying, "updated_user" character varying(254) DEFAULT NULL::character varying, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7de5fe68170cc0ae75b1399e25c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "term_of_service_user_pkey" ON "public"."term_of_service_user" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."term_of_service" ("id" BIGSERIAL NOT NULL, "version_number" character varying(50), "data" text, "is_active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_user" character varying(254) DEFAULT NULL::character varying, "updated_user" character varying(254) DEFAULT NULL::character varying, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_17db7c622acdca790e47fb900c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "term_of_service_pkey" ON "public"."term_of_service" ("id") `);
        await queryRunner.query(`CREATE TABLE "public"."user_profile" ("id" BIGSERIAL NOT NULL, "confirmation_token" character varying(100), "email" character varying(100), "phone_number" character varying(20), "fullname" character varying(120), "enabled" boolean DEFAULT true, "user_type" smallint, "avatar" character varying(255), "device_token" character varying(255), "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, "created_by" character varying(120), "updated_by" character varying(120), CONSTRAINT "PK_56bc6da5b4b5466fbb92d7d96b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."user_role" ("id" BIGSERIAL NOT NULL, "user_id" integer, "role_id" integer, CONSTRAINT "PK_294737c12b5cc236297c8f9f7ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_role_pkey" ON "public"."user_role" ("id") `);
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
        await queryRunner.query(`DROP INDEX "public"."user_role_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."user_role"`);
        await queryRunner.query(`DROP TABLE "public"."user_profile"`);
        await queryRunner.query(`DROP INDEX "public"."term_of_service_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."term_of_service"`);
        await queryRunner.query(`DROP INDEX "public"."term_of_service_user_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."term_of_service_user"`);
        await queryRunner.query(`DROP TABLE "public"."role"`);
        await queryRunner.query(`DROP INDEX "public"."resource_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."resource"`);
        await queryRunner.query(`DROP INDEX "public"."resource_action_pkey"`);
        await queryRunner.query(`DROP TABLE "public"."resource_action"`);
        await queryRunner.query(`DROP TABLE "public"."address"`);
    }

}
