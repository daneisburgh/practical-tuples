import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1648403409337 implements MigrationInterface {
    name = "Migration1648403409337";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "connection" ADD "uuid" character varying(32) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "UQ_77559e358d2111425be5344587d" UNIQUE ("uuid")`
        );
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "UQ_0683d0c6ce6c0327208a026da57" UNIQUE ("uuid")`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "PK_be611ce8b8cf439091c82a334b2"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "connection" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "PK_be611ce8b8cf439091c82a334b2"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "connection" ADD "id" character varying(32) NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id")`
        );
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "UQ_0683d0c6ce6c0327208a026da57"`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "UQ_77559e358d2111425be5344587d"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "uuid"`);
    }
}
