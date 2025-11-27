import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewFields1764215525108 implements MigrationInterface {
  name = 'NewFields1764215525108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`posts\` MODIFY \`cover\` varchar(900)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`posts\` MODIFY \`cover\` varchar(255)`);
  }
}
