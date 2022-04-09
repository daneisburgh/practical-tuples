import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1648406967746 implements MigrationInterface {
    name = "Migration1648406967746";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`
        );
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`
        );
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
