import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1648591414922 implements MigrationInterface {
    name = "Migration1648591414922";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`
        );
        await queryRunner.query(`ALTER TABLE "connection" RENAME COLUMN "userId" TO "deviceId"`);
        await queryRunner.query(`ALTER TABLE "device" ADD "connectionId" character varying`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "UQ_50119c4bbc8aaa8b6f4d5e85c2f" UNIQUE ("connectionId")`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "deviceId"`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD "deviceId" character varying NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_50119c4bbc8aaa8b6f4d5e85c2f" FOREIGN KEY ("connectionId") REFERENCES "connection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "FK_50119c4bbc8aaa8b6f4d5e85c2f"`
        );
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "deviceId"`);
        await queryRunner.query(`ALTER TABLE "connection" ADD "deviceId" integer`);
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "UQ_50119c4bbc8aaa8b6f4d5e85c2f"`
        );
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "connectionId"`);
        await queryRunner.query(`ALTER TABLE "connection" RENAME COLUMN "deviceId" TO "userId"`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
    }
}
