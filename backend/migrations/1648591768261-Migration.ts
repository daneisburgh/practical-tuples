import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1648591768261 implements MigrationInterface {
    name = "Migration1648591768261";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "FK_50119c4bbc8aaa8b6f4d5e85c2f"`
        );
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "connectionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "deviceId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_50119c4bbc8aaa8b6f4d5e85c2f" FOREIGN KEY ("connectionId") REFERENCES "connection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "FK_50119c4bbc8aaa8b6f4d5e85c2f"`
        );
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "deviceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "connectionId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_50119c4bbc8aaa8b6f4d5e85c2f" FOREIGN KEY ("connectionId") REFERENCES "connection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
    }
}
