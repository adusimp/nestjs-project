import { MigrationInterface, QueryRunner } from "typeorm";

export class Alterfilepath1751599557555 implements MigrationInterface {
    name = 'Alterfilepath1751599557555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`file_path\` \`file_path\` varchar(255) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` CHANGE \`file_path\` \`file_path\` varchar(255) NOT NULL`);
    }

}
