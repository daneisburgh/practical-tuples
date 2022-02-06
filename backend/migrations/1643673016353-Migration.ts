import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1643673016353 implements MigrationInterface {
    name = "Migration1643673016353";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD "isChecked" boolean NOT NULL DEFAULT false`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "isChecked"`);
    }
}
