import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1642372707135 implements MigrationInterface {
    name = "Migration1642372707135";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tuple_item" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying NOT NULL, "tupleId" integer NOT NULL, CONSTRAINT "PK_21b19f6521784eb4bdc2d533196" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TYPE "public"."tuple_type_enum" AS ENUM('List', 'Checkbox')`
        );
        await queryRunner.query(
            `CREATE TABLE "tuple" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT 'New tuple', "type" "public"."tuple_type_enum" NOT NULL DEFAULT 'List', "creatorId" integer, CONSTRAINT "PK_1f31119186fd85ab740ae576bec" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "connectionId" character varying(32), CONSTRAINT "UQ_d13bdc217de614574be822c24a3" UNIQUE ("connectionId"), CONSTRAINT "REL_d13bdc217de614574be822c24a" UNIQUE ("connectionId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "connection" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying(32) NOT NULL, CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "user_tuples_tuple" ("userId" integer NOT NULL, "tupleId" integer NOT NULL, CONSTRAINT "PK_d1626734b964bb0d015a18eff97" PRIMARY KEY ("userId", "tupleId"))`
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_6cc7c1876ceeb83f28171334dc" ON "user_tuples_tuple" ("userId") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_b5ecd6bf0359757de2c7bed3a4" ON "user_tuples_tuple" ("tupleId") `
        );
        await queryRunner.query(
            `ALTER TABLE "tuple_item" ADD CONSTRAINT "FK_5fce0713f42fc9fd3ce6dcf6922" FOREIGN KEY ("tupleId") REFERENCES "tuple"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "tuple" ADD CONSTRAINT "FK_6346292aa61b53a16d1882c0e01" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_d13bdc217de614574be822c24a3" FOREIGN KEY ("connectionId") REFERENCES "connection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "user_tuples_tuple" ADD CONSTRAINT "FK_6cc7c1876ceeb83f28171334dca" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
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
            `ALTER TABLE "user_tuples_tuple" DROP CONSTRAINT "FK_6cc7c1876ceeb83f28171334dca"`
        );
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_d13bdc217de614574be822c24a3"`
        );
        await queryRunner.query(
            `ALTER TABLE "tuple" DROP CONSTRAINT "FK_6346292aa61b53a16d1882c0e01"`
        );
        await queryRunner.query(
            `ALTER TABLE "tuple_item" DROP CONSTRAINT "FK_5fce0713f42fc9fd3ce6dcf6922"`
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_b5ecd6bf0359757de2c7bed3a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6cc7c1876ceeb83f28171334dc"`);
        await queryRunner.query(`DROP TABLE "user_tuples_tuple"`);
        await queryRunner.query(`DROP TABLE "connection"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "tuple"`);
        await queryRunner.query(`DROP TYPE "public"."tuple_type_enum"`);
        await queryRunner.query(`DROP TABLE "tuple_item"`);
    }
}
