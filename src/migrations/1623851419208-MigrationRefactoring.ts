import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationRefactoring1623851419208 implements MigrationInterface {
    name = 'MigrationRefactoring1623851419208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."address" ("id" BIGSERIAL NOT NULL, "user_id" integer NOT NULL, "phone_number_contact" character varying(20), "address_no" character varying(20), "moo" character varying(3), "soi" character varying(50), "road" character varying(30), "district_province_id" character varying(6), "zip_code" character varying(5), "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "created_by" character varying(120), "updated_by" character varying(120), CONSTRAINT "PK_3d1e15b90ff2a5f2bfc431c6bdd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."user_profile" ("id" BIGSERIAL NOT NULL, "confirmation_token" character varying(100), "email" character varying(100), "phone_number" character varying(20), "fullname" character varying(120), "enabled" boolean DEFAULT true, "user_type" smallint, "avatar" character varying(255), "device_token" character varying(255), "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "created_by" character varying(120), "updated_by" character varying(120), CONSTRAINT "PK_56bc6da5b4b5466fbb92d7d96b3" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ["VIEW","public","vw_user_role_resource"]);
        await queryRunner.query(`DROP VIEW "vw_user_role_resource"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`, ["VIEW","public","vw_user_role"]);
        await queryRunner.query(`DROP VIEW "vw_user_role"`);
        await queryRunner.query(`DROP TABLE "public"."user_profile"`);
        await queryRunner.query(`DROP TABLE "public"."address"`);
    }

}
