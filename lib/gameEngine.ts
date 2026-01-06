import { GameTheme } from '@/constants/gameTheme';

type BuildingType = 'SKYSCRAPER' | 'MIDRISE' | 'BROWNSTONE' | 'BODEGA';

export class Building {
  id: number;
  type: BuildingType;
  x: number;
  width: number;
  height: number;
  y: number;
  colors: {
    main: string;
    accent: string;
    roof: string;
    window: string;
  };
  roofX: number;
  roofY: number;
  roofWidth: number;
  roofHeight: number;
  windowPattern: boolean[][];

  constructor(id: number, xPos: number, type: BuildingType) {
    this.id = id;
    this.type = type;
    this.x = xPos;
    const config = GameTheme.buildings[type.toLowerCase() as keyof typeof GameTheme.buildings];
    this.width = config.widthMin + Math.random() * (config.widthMax - config.widthMin);
    this.height = config.heightMin + Math.random() * (config.heightMax - config.heightMin);
    this.y = GameTheme.dimensions.screenHeight - this.height;
    this.colors = GameTheme.colors[type.toLowerCase() as keyof typeof GameTheme.colors] as any;
    
    this.roofX = this.x - 8;
    this.roofY = this.y + GameTheme.dimensions.roofOffsetY;
    this.roofWidth = this.width + 16;
    this.roofHeight = GameTheme.dimensions.roofHeight;
    
    this.windowPattern = this._generateWindowPattern();
  }
  
  _generateWindowPattern(): boolean[][] {
    const windowRows = Math.floor(this.height / 35);
    const windowCols = this.type === 'SKYSCRAPER' ? 4 : 3;
    const pattern: boolean[][] = [];
    
    for (let row = 0; row < windowRows; row++) {
      const rowPattern: boolean[] = [];
      for (let col = 0; col < windowCols; col++) {
        rowPattern.push(Math.random() > 0.5);
      }
      pattern.push(rowPattern);
    }
    
    return pattern;
  }
  
  isPlayerOnRoof(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    const playerLeft = playerX - playerWidth / 2;
    const playerRight = playerX + playerWidth / 2;
    const playerBottom = playerY + playerHeight / 2;
    
    const horizontalOverlap = playerRight > this.roofX && playerLeft < this.roofX + this.roofWidth;
    if (!horizontalOverlap) return false;
    
    const distanceToRoof = Math.abs(playerBottom - this.roofY);
    return distanceToRoof <= 10;
  }
  
  getScreenX(cameraOffset: number): number {
    return this.x - cameraOffset;
  }
}

export class Player {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isGrounded: boolean;
  jumpsAvailable: number;
  width: number;
  height: number;

  constructor() {
    this.x = GameTheme.dimensions.screenWidth / 2;
    this.y = 200;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isGrounded = false;
    this.jumpsAvailable = 2;
    this.width = GameTheme.dimensions.playerWidth;
    this.height = GameTheme.dimensions.playerHeight;
  }
  
  jump(): boolean {
    if (this.jumpsAvailable > 0) {
      this.velocityY = GameTheme.physics.jumpPower;
      this.jumpsAvailable--;
      this.isGrounded = false;
      return true;
    }
    return false;
  }
  
  landOnRoof(roofY: number): void {
    this.y = roofY - this.height / 2;
    this.velocityY = 0;
    this.isGrounded = true;
    this.jumpsAvailable = 2;
  }
  
  setAirborne(): void {
    this.isGrounded = false;
  }
  
  applyGravity(): void {
    this.velocityY += GameTheme.physics.gravity;
  }
  
  updatePosition(): void {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

export type ProjectileType = 'piano' | 'anvil' | 'pizza' | 'rat' | 'needle' | 'taxi' | 'brick';

export class Projectile {
  id: number;
  type: ProjectileType;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  rotation: number;

  constructor(id: number, type: ProjectileType, x: number, y: number) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.velocityX = -1.5 - Math.random() * 1;
    this.velocityY = Math.random() * 1 - 0.5;
    this.rotation = Math.random() * 360;
    
    switch (type) {
      case 'piano':
        this.width = 40;
        this.height = 35;
        break;
      case 'anvil':
        this.width = 30;
        this.height = 30;
        break;
      case 'pizza':
        this.width = 35;
        this.height = 35;
        break;
      case 'rat':
        this.width = 25;
        this.height = 15;
        break;
      case 'needle':
        this.width = 20;
        this.height = 40;
        break;
      case 'taxi':
        this.width = 45;
        this.height = 25;
        break;
      case 'brick':
        this.width = 25;
        this.height = 15;
        break;
    }
  }

  update(): void {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.rotation += 3;
  }

  getScreenX(cameraOffset: number): number {
    return this.x - cameraOffset;
  }

  checkCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): boolean {
    const playerLeft = playerX - playerWidth / 2;
    const playerRight = playerX + playerWidth / 2;
    const playerTop = playerY - playerHeight / 2;
    const playerBottom = playerY + playerHeight / 2;

    const projLeft = this.x - this.width / 2;
    const projRight = this.x + this.width / 2;
    const projTop = this.y - this.height / 2;
    const projBottom = this.y + this.height / 2;

    return (
      playerRight > projLeft &&
      playerLeft < projRight &&
      playerBottom > projTop &&
      playerTop < projBottom
    );
  }
}

export interface BuildingData {
  id: number;
  type: BuildingType;
  x: number;
  width: number;
  height: number;
  y: number;
  colors: {
    main: string;
    accent: string;
    roof: string;
    window: string;
  };
  roofX: number;
  roofY: number;
  roofWidth: number;
  roofHeight: number;
  windowPattern: boolean[][];
  screenX: number;
}

export interface ProjectileData {
  id: number;
  type: ProjectileType;
  screenX: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface GameState {
  player: {
    screenX: number;
    y: number;
    width: number;
    height: number;
    isGrounded: boolean;
    jumpsAvailable: number;
  };
  buildings: BuildingData[];
  projectiles: ProjectileData[];
  score: number;
  isRunning: boolean;
  cameraOffset: number;
}

export class GameEngine {
  player: Player;
  buildings: Building[];
  projectiles: Projectile[];
  cameraOffset: number;
  score: number;
  isRunning: boolean;
  keys: { left: boolean; right: boolean };
  projectileSpawnTimer: number;

  constructor() {
    this.player = new Player();
    this.buildings = [];
    this.projectiles = [];
    this.cameraOffset = 0;
    this.score = 0;
    this.isRunning = false;
    this.keys = { left: false, right: false };
    this.projectileSpawnTimer = 0;
  }
  
  start(): void {
    this.buildings = this._createBuildings();
    this.projectiles = [];
    const first = this.buildings[0];
    this.player.x = first.x + first.width / 2;
    this.player.y = first.roofY - GameTheme.dimensions.playerHeight / 2;
    this.player.velocityY = 0;
    this.player.isGrounded = true;
    this.score = 0;
    this.cameraOffset = 0;
    this.isRunning = true;
    this.projectileSpawnTimer = 0;
  }
  
  _createBuildings(): Building[] {
    const types: BuildingType[] = ['SKYSCRAPER', 'MIDRISE', 'BROWNSTONE', 'BODEGA'];
    const buildings: Building[] = [];
    
    const startingPlatformWidth = 300;
    const startingPlatformX = GameTheme.dimensions.screenWidth / 2 - startingPlatformWidth / 2;
    const startingBuilding = new Building(0, startingPlatformX, 'MIDRISE');
    startingBuilding.width = startingPlatformWidth;
    startingBuilding.roofX = startingBuilding.x - 8;
    startingBuilding.roofWidth = startingBuilding.width + 16;
    buildings.push(startingBuilding);
    
    let xPos = startingPlatformX + startingPlatformWidth + (100 + Math.random() * 70);
    for (let i = 1; i < 20; i++) {
      const prevBuilding = buildings[buildings.length - 1];
      const type = types[Math.floor(Math.random() * types.length)];
      const newBuilding = this._createReachableBuilding(i, xPos, type, prevBuilding);
      buildings.push(newBuilding);
      xPos += newBuilding.width + (100 + Math.random() * 80);
    }
    return buildings;
  }
  
  _createReachableBuilding(id: number, xPos: number, type: BuildingType, prevBuilding: Building): Building {
    const maxJumpHeight = 120;
    const maxJumpDown = 180;
    
    const prevRoofY = prevBuilding.roofY;
    const minRoofY = prevRoofY - maxJumpHeight;
    const maxRoofY = prevRoofY + maxJumpDown;
    
    const newBuilding = new Building(id, xPos, type);
    
    if (newBuilding.roofY < minRoofY) {
      const adjustment = minRoofY - newBuilding.roofY;
      newBuilding.height -= adjustment;
      newBuilding.y = GameTheme.dimensions.screenHeight - newBuilding.height;
      newBuilding.roofY = newBuilding.y + GameTheme.dimensions.roofOffsetY;
    } else if (newBuilding.roofY > maxRoofY) {
      const adjustment = newBuilding.roofY - maxRoofY;
      newBuilding.height -= adjustment;
      newBuilding.y = GameTheme.dimensions.screenHeight - newBuilding.height;
      newBuilding.roofY = newBuilding.y + GameTheme.dimensions.roofOffsetY;
    }
    
    const minHeight = 60;
    if (newBuilding.height < minHeight) {
      newBuilding.height = minHeight;
      newBuilding.y = GameTheme.dimensions.screenHeight - newBuilding.height;
      newBuilding.roofY = newBuilding.y + GameTheme.dimensions.roofOffsetY;
    }
    
    return newBuilding;
  }
  
  update(): void {
    if (!this.isRunning) return;
    
    this.player.x += GameTheme.physics.autoScrollSpeed;
    this.cameraOffset += GameTheme.physics.autoScrollSpeed;
    
    this.player.applyGravity();
    this.player.updatePosition();
    
    if (this.player.velocityY >= 0) {
      let standingOnRoof = false;
      let roofY: number | null = null;
      for (const building of this.buildings) {
        if (building.isPlayerOnRoof(this.player.x, this.player.y, this.player.width, this.player.height)) {
          standingOnRoof = true;
          roofY = building.roofY;
          break;
        }
      }
      if (standingOnRoof && roofY !== null) {
        this.player.landOnRoof(roofY);
      } else {
        this.player.setAirborne();
      }
    }
    
    this.projectileSpawnTimer++;
    if (this.projectileSpawnTimer > 90) {
      this.projectileSpawnTimer = 0;
      this._spawnProjectile();
    }
    
    for (const projectile of this.projectiles) {
      projectile.update();
      if (projectile.checkCollision(this.player.x, this.player.y, this.player.width, this.player.height)) {
        this.isRunning = false;
      }
    }
    
    this.projectiles = this.projectiles.filter(p => p.getScreenX(this.cameraOffset) > -100);
    
    const last = this.buildings[this.buildings.length - 1];
    if (last.getScreenX(this.cameraOffset) < 1400) {
      const types: BuildingType[] = ['SKYSCRAPER', 'MIDRISE', 'BROWNSTONE', 'BODEGA'];
      const type = types[Math.floor(Math.random() * types.length)];
      const xPos = last.x + last.width + (100 + Math.random() * 80);
      const newBuilding = this._createReachableBuilding(Date.now(), xPos, type, last);
      this.buildings.push(newBuilding);
    }
    this.buildings = this.buildings.filter(b => b.getScreenX(this.cameraOffset) > -400);
    if (this.player.y > 500 || this.player.x - this.cameraOffset < -50) this.isRunning = false;
    this.score++;
  }
  
  _spawnProjectile(): void {
    const types: ProjectileType[] = ['piano', 'anvil', 'pizza', 'rat', 'needle', 'taxi', 'brick'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const spawnType = Math.random();
    let x: number;
    let y: number;
    let projectile: Projectile;
    
    if (spawnType < 0.7) {
      x = this.cameraOffset + GameTheme.dimensions.screenWidth + 50;
      y = 20 + Math.random() * 200;
      projectile = new Projectile(Date.now(), type, x, y);
      projectile.velocityX = -1.5 - Math.random() * 1;
      projectile.velocityY = Math.random() * 1 - 0.5;
    } else {
      x = this.cameraOffset + 100 + Math.random() * (GameTheme.dimensions.screenWidth - 200);
      y = -50;
      projectile = new Projectile(Date.now(), type, x, y);
      projectile.velocityX = (Math.random() - 0.5) * 2;
      projectile.velocityY = 2 + Math.random() * 2;
    }
    
    this.projectiles.push(projectile);
  }
  
  getState(): GameState {
    return {
      player: {
        screenX: this.player.x - this.cameraOffset,
        y: this.player.y,
        width: this.player.width,
        height: this.player.height,
        isGrounded: this.player.isGrounded,
        jumpsAvailable: this.player.jumpsAvailable,
      },
      buildings: this.buildings.map(b => ({
        id: b.id,
        type: b.type,
        x: b.x,
        width: b.width,
        height: b.height,
        y: b.y,
        colors: b.colors,
        roofX: b.roofX,
        roofY: b.roofY,
        roofWidth: b.roofWidth,
        roofHeight: b.roofHeight,
        windowPattern: b.windowPattern,
        screenX: b.getScreenX(this.cameraOffset),
      })),
      projectiles: this.projectiles.map(p => ({
        id: p.id,
        type: p.type,
        screenX: p.getScreenX(this.cameraOffset),
        y: p.y,
        width: p.width,
        height: p.height,
        rotation: p.rotation,
      })),
      score: this.score,
      isRunning: this.isRunning,
      cameraOffset: this.cameraOffset,
    };
  }
}
