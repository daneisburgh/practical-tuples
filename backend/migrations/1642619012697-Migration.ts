import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1642619012697 implements MigrationInterface {
    name = "Migration1642619012697";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" DROP CONSTRAINT "FK_6cc7c1876ceeb83f28171334dca"`
        );
        await queryRunner.query(`ALTER TABLE "tuple" ALTER COLUMN "name" SET DEFAULT 'New Tuple'`);
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" ADD CONSTRAINT "FK_6cc7c1876ceeb83f28171334dca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" DROP CONSTRAINT "FK_6cc7c1876ceeb83f28171334dca"`
        );
        await queryRunner.query(`ALTER TABLE "tuple" ALTER COLUMN "name" SET DEFAULT 'New tuple'`);
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" ADD CONSTRAINT "FK_6cc7c1876ceeb83f28171334dca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }
}
