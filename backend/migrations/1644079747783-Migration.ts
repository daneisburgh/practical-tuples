import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1644079747783 implements MigrationInterface {
    name = "Migration1644079747783";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "value"`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD "value" character varying(20) NOT NULL DEFAULT 'New Tuple Item'`
        );
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "name"`);
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD "name" character varying(20) NOT NULL DEFAULT 'New Tuple'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "name"`);
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD "name" character varying NOT NULL DEFAULT 'New Tuple'`
        );
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "value"`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD "value" character varying NOT NULL DEFAULT 'New Tuple Item'`
        );
    }
}
