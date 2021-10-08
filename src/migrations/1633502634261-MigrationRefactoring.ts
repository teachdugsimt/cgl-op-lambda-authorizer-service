import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationRefactoring1633502634261 implements MigrationInterface {
    name = 'MigrationRefactoring1633502634261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "term_of_service" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."enum_user_status"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "legal_type"`);
        await queryRunner.query(`DROP TYPE "public"."enum_legal_type"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "document"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "document_status"`);
        await queryRunner.query(`DROP TYPE "public"."enum_user_document_status"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "attach_code_citizen_id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "version" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "created_at" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "updated_at" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "created_user" SET DEFAULT NULL::character varying`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "updated_user" SET DEFAULT NULL::character varying`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "version" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" DROP CONSTRAINT "PK_4914186238095152792131fc79f"`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ADD CONSTRAINT "PK_4914186238095152792131fc79f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "version" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "created_at" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "updated_at" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "created_user" SET DEFAULT NULL::character varying`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "updated_user" SET DEFAULT NULL::character varying`);
        await queryRunner.query(`ALTER TABLE "term_of_service" DROP CONSTRAINT "PK_5fb08d0c57f8b60cea751cc7d21"`);
        await queryRunner.query(`ALTER TABLE "term_of_service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ADD "id" BIGSERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ADD CONSTRAINT "PK_5fb08d0c57f8b60cea751cc7d21" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "version" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "created_at" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "updated_at" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "created_user" SET DEFAULT NULL::character varying`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "updated_user" SET DEFAULT NULL::character varying`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "constraint_phone_number"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."enum_user_type"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "user_type" smallint`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_role" ADD CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561" PRIMARY KEY ("id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "resource_action_pkey" ON "resource_action" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "resource_pkey" ON "resource" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "term_of_service_user_pkey" ON "term_of_service_user" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "term_of_service_pkey" ON "term_of_service" ("id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_role_pkey" ON "user_role" ("id") `);
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
        await queryRunner.query(`DROP INDEX "public"."user_role_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."term_of_service_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."term_of_service_user_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."resource_pkey"`);
        await queryRunner.query(`DROP INDEX "public"."resource_action_pkey"`);
        await queryRunner.query(`ALTER TABLE "user_role" DROP CONSTRAINT "PK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "user_type"`);
        await queryRunner.query(`CREATE TYPE "public"."enum_user_type" AS ENUM('SHIPPER', 'CARRIER', 'BOTH')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "user_type" "public"."enum_user_type"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "constraint_phone_number" UNIQUE ("phone_number")`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7"`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "updated_user" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "created_user" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "updated_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "created_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ALTER COLUMN "version" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "term_of_service" DROP CONSTRAINT "PK_5fb08d0c57f8b60cea751cc7d21"`);
        await queryRunner.query(`ALTER TABLE "term_of_service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ADD "id" integer NOT NULL DEFAULT nextval('dtb_term_of_service_seq')`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ADD CONSTRAINT "PK_5fb08d0c57f8b60cea751cc7d21" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "updated_user" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "created_user" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "updated_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "created_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ALTER COLUMN "version" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" DROP CONSTRAINT "PK_4914186238095152792131fc79f"`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ADD "id" integer NOT NULL DEFAULT nextval('dtb_term_of_service_user_seq')`);
        await queryRunner.query(`ALTER TABLE "term_of_service_user" ADD CONSTRAINT "PK_4914186238095152792131fc79f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "version" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "updated_user" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "created_user" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "updated_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "created_at" TYPE TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "version" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "attach_code_citizen_id" character varying(255)`);
        await queryRunner.query(`CREATE TYPE "public"."enum_user_document_status" AS ENUM('NO_DOCUMENT', 'WAIT_FOR_VERIFIED', 'VERIFIED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "document_status" "public"."enum_user_document_status" NOT NULL DEFAULT 'NO_DOCUMENT'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "document" jsonb`);
        await queryRunner.query(`CREATE TYPE "public"."enum_legal_type" AS ENUM('INDIVIDUAL', 'JURISTIC')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "legal_type" "public"."enum_legal_type" NOT NULL DEFAULT 'INDIVIDUAL'`);
        await queryRunner.query(`CREATE TYPE "public"."enum_user_status" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "status" "public"."enum_user_status" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "term_of_service" ADD "type" character varying(20)`);
    }

}
