import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1648406114551 implements MigrationInterface {
    name = "Migration1648406114551";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" DROP CONSTRAINT "FK_b5ecd6bf0359757de2c7bed3a46"`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" ADD CONSTRAINT "FK_b5ecd6bf0359757de2c7bed3a46" FOREIGN KEY ("tupleId") REFERENCES "tuple"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" DROP CONSTRAINT "FK_b5ecd6bf0359757de2c7bed3a46"`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" ADD CONSTRAINT "FK_b5ecd6bf0359757de2c7bed3a46" FOREIGN KEY ("tupleId") REFERENCES "tuple"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }
}
