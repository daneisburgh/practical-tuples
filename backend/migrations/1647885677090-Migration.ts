import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647885677090 implements MigrationInterface {
    name = "Migration1647885677090";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "uuid" uuid NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72"`
        );
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id")`
        );
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_d13bdc217de614574be822c24a3"`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "PK_be611ce8b8cf439091c82a334b2"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "connection" ADD "id" character varying(12) NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id")`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_d13bdc217de614574be822c24a3" FOREIGN KEY ("connectionId") REFERENCES "connection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_d13bdc217de614574be822c24a3"`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "PK_be611ce8b8cf439091c82a334b2"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "connection" ADD "id" character varying(32) NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id")`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_d13bdc217de614574be822c24a3" FOREIGN KEY ("connectionId") REFERENCES "connection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72"`
        );
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "id" uuid NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id")`
        );
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "uuid"`);
    }
}
