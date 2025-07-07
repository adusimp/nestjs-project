import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTask1751597751412 implements MigrationInterface {
  name = 'AddTask1751597751412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`cats\` DROP COLUMN \`color\``);
    await queryRunner.query(`ALTER TABLE \`cats\` DROP COLUMN \`nickname\``);
    await queryRunner.query(
      `ALTER TABLE \`task\` ADD \`file_path\` varchar(255) DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`task\` DROP COLUMN \`file_path\``);
    await queryRunner.query(
      `ALTER TABLE \`cats\` ADD \`nickname\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cats\` ADD \`color\` varchar(255) NULL`,
    );
  }
}
