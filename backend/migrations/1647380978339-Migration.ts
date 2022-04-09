import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647380978339 implements MigrationInterface {
    name = "Migration1647380978339";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tuple" DROP CONSTRAINT "FK_6346292aa61b53a16d1882c0e01"`
        );
        await queryRunner.query(`ALTER TABLE "tuple" DROP COLUMN "creatorId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tuple" ADD "creatorId" integer`);
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD CONSTRAINT "FK_6346292aa61b53a16d1882c0e01" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
