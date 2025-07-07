import { MigrationInterface, QueryRunner } from "typeorm";

export class Add2Field1751880488972 implements MigrationInterface {
    name = 'Add2Field1751880488972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`CreatedAt\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`UpdatedAt\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`CreatedAt\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD \`UpdatedAt\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`UpdatedAt\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`CreatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`UpdatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`CreatedAt\``);
    }

}
