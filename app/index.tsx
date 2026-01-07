import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { GameEngine, type GameState } from '@/lib/gameEngine';
import {
  SkyBackground,
  PlayerComponent,
  BuildingComponent,
  ProjectileComponent,
  HUDComponent,
  GameOverScreen,
} from '@/components/GameComponents';
import { GameTheme } from '@/constants/gameTheme';

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    console.log('Initializing game engine');
    engineRef.current = new GameEngine();
    engineRef.current.start();

    const updateGame = () => {
      if (engineRef.current) {
        engineRef.current.update();
        setGameState(engineRef.current.getState());
      }
      animationFrameRef.current = requestAnimationFrame(updateGame);
    };

    animationFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!engineRef.current) return;
        if (e.key === 'ArrowUp' || e.key === ' ') {
          e.preventDefault();
          engineRef.current.player.jump();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const handleJump = () => {
    if (!engineRef.current) return;
    engineRef.current.player.jump();
  };

  const handleRestart = () => {
    console.log('Restarting game');
    if (engineRef.current) {
      engineRef.current = new GameEngine();
      engineRef.current.start();
      setGameState(engineRef.current.getState());
    }
  };

  if (!gameState) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.gameContainer}
        onPress={handleJump}
        onPressIn={handleJump}
      >
        <SkyBackground cameraOffset={gameState.cameraOffset} />
        
        {gameState.buildings.map((building) => (
          <BuildingComponent key={building.id} building={building} />
        ))}
        
        {gameState.projectiles.map((projectile) => (
          <ProjectileComponent key={projectile.id} projectile={projectile} />
        ))}
        
        <PlayerComponent
          screenX={gameState.player.screenX}
          y={gameState.player.y}
          width={gameState.player.width}
          height={gameState.player.height}
        />
        
        <HUDComponent
          score={gameState.score}
          jumpsAvailable={gameState.player.jumpsAvailable}
          isGrounded={gameState.player.isGrounded}
        />
        
        {!gameState.isRunning && (
          <GameOverScreen score={gameState.score} onRestart={handleRestart} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameContainer: {
    width: GameTheme.dimensions.screenWidth,
    height: GameTheme.dimensions.screenHeight,
    position: 'relative',
    overflow: 'hidden',
  },
});
