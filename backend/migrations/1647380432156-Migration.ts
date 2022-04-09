import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1647380432156 implements MigrationInterface {
    name = "Migration1647380432156";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" DROP CONSTRAINT "FK_b5ecd6bf0359757de2c7bed3a46"`
        );
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
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
            `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`
        );
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" ADD CONSTRAINT "FK_b5ecd6bf0359757de2c7bed3a46" FOREIGN KEY ("tupleId") REFERENCES "tuple"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
