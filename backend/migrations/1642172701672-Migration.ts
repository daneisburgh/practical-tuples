import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1642172701672 implements MigrationInterface {
    name = "Migration1642172701672";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "name"`);
    }
}
