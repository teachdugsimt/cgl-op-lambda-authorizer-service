import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationRefactoring1628847916191 implements MigrationInterface {
    name = 'MigrationRefactoring1628847916191'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

}
