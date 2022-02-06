import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1643755259597 implements MigrationInterface {
    name = "Migration1643755259597";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple_item" ADD "order" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "order"`);
    }
}
