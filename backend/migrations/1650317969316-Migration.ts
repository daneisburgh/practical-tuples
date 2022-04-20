import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1650317969316 implements MigrationInterface {
    name = "Migration1650317969316";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple_item" RENAME COLUMN "value" TO "name"`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ALTER COLUMN "name" SET DEFAULT 'New item'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ALTER COLUMN "name" SET DEFAULT 'New tuple item'`
        );
        await queryRunner.query(`ALTER TABLE "tuple_item" RENAME COLUMN "name" TO "value"`);
    }
}
