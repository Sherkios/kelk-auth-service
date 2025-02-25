import { Module } from '@nestjs/common';
import RolesGuard from 'src/roles/roles.guards';

@Module({
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export default class RolesModule {}
