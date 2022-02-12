import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1644250389058 implements MigrationInterface {
    name = "Migration1644250389058";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "updatedAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "updatedAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "updatedAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "updatedAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`ALTER TABLE "tuple_item" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
    }
}
