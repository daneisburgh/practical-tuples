import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647895049210 implements MigrationInterface {
    name = "Migration1647895049210";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "isVerified" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "isVerified" DROP DEFAULT`);
    }
}
