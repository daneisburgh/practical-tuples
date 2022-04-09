import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1646696382374 implements MigrationInterface {
    name = "Migration1646696382374";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ALTER COLUMN "value" SET DEFAULT 'New tuple item'`
        );
        await queryRunner.query(`ALTER TABLE "tuple" ALTER COLUMN "name" SET DEFAULT 'New tuple'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple" ALTER COLUMN "name" SET DEFAULT 'New Tuple'`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ALTER COLUMN "value" SET DEFAULT 'New Tuple Item'`
        );
    }
}
