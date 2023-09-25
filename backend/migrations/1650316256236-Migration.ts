import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1650316256236 implements MigrationInterface {
    name = "Migration1650316256236";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tuple_item" DROP CONSTRAINT "FK_5fce0713f42fc9fd3ce6dcf6922"`
        );
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD CONSTRAINT "FK_5fce0713f42fc9fd3ce6dcf6922" FOREIGN KEY ("tupleId") REFERENCES "tuple"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tuple_item" DROP CONSTRAINT "FK_5fce0713f42fc9fd3ce6dcf6922"`
        );
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD CONSTRAINT "FK_5fce0713f42fc9fd3ce6dcf6922" FOREIGN KEY ("tupleId") REFERENCES "tuple"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }
}