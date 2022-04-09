import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1648402780002 implements MigrationInterface {
    name = "Migration1648402780002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`
        );
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_d13bdc217de614574be822c24a3"`
        );
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "UQ_d13bdc217de614574be822c24a3"`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "connectionId"`);
        await queryRunner.query(`ALTER TABLE "connection" ADD "userId" integer`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`
        );
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "connectionId" character varying(32)`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "UQ_d13bdc217de614574be822c24a3" UNIQUE ("connectionId")`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_d13bdc217de614574be822c24a3" FOREIGN KEY ("connectionId") REFERENCES "connection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }
}
