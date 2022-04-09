import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647798241218 implements MigrationInterface {
    name = "Migration1647798241218";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "isValid" TO "isVerified"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" RENAME COLUMN "isVerified" TO "isValid"`);
    }
}
