import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { AdminUsersService } from './admin-users.service.js';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  async listUsers() {
    return this.adminUsersService.listUsers();
  }

  @Patch(':id/role')
  async setRole(@Param('id') id: string, @Body() body: { role: string }) {
    return this.adminUsersService.setRole(id, body.role);
  }

  @Patch(':id/suspend')
  async setSuspended(@Param('id') id: string, @Body() body: { suspend: boolean }) {
    return this.adminUsersService.setSuspended(id, body.suspend);
  }
}
