import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1642465305344 implements MigrationInterface {
    name = "Migration1642465305344";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple" ALTER COLUMN "name" SET DEFAULT 'New Tuple'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple" ALTER COLUMN "name" SET DEFAULT 'New tuple'`);
    }
}
