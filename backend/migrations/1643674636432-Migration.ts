import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1643674636432 implements MigrationInterface {
    name = "Migration1643674636432";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ALTER COLUMN "value" SET DEFAULT 'New Tuple Item'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple_item" ALTER COLUMN "value" DROP DEFAULT`);
    }
}
