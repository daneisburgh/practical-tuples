import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647810449928 implements MigrationInterface {
    name = "Migration1647810449928";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72"`
        );
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "id" uuid NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72"`
        );
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "id" character varying(100) NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id")`
        );
    }
}
