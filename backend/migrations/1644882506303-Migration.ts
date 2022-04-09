import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1644882506303 implements MigrationInterface {
    name = "Migration1644882506303";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "device" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "hash" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
        );
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "createdAt"`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
        );
        await queryRunner.query(`DROP TABLE "device"`);
    }
}
