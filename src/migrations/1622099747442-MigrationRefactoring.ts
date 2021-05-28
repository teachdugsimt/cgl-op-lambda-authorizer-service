import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationRefactoring1622099747442 implements MigrationInterface {
    name = 'MigrationRefactoring1622099747442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_example" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_028876d9c4b4de2973112c3bffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resource_action" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "resource_id" integer NOT NULL, "action" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_33821b4abebff3283fe2ee6bdaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resource" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vw_resource_action" ("id" integer NOT NULL, "role" character varying NOT NULL, "resource_name" character varying NOT NULL, "action" character varying NOT NULL, "resource" character varying NOT NULL, CONSTRAINT "PK_afd7431fb514c477fbde2544bf7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "resource_name"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "resource"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "resource_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "action" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "resource" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "role_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "role_name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "role_name"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "resource"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "action"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "resource_name"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "resource" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "action" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "resource_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vw_resource_action" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "vw_resource_action"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "resource"`);
        await queryRunner.query(`DROP TABLE "resource_action"`);
        await queryRunner.query(`DROP TABLE "user_example"`);
    }

}
