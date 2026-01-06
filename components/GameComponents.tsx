import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GameTheme } from '@/constants/gameTheme';
import type { BuildingData, ProjectileData } from '@/lib/gameEngine';

export const SkyBackground = ({ cameraOffset }: { cameraOffset: number }) => (
  <View style={styles.skyContainer}>
    <LinearGradient
      colors={[GameTheme.colors.skyTop, GameTheme.colors.skyMid, GameTheme.colors.skyBottom]}
      style={StyleSheet.absoluteFill}
    />
    {[...Array(5)].map((_, i) => (
      <View
        key={i}
        style={[
          styles.cloud,
          {
            left: `${((i * 25 + (cameraOffset * 0.1)) % 120) - 10}%`,
            top: `${10 + i * 12}%`,
          },
        ]}
      />
    ))}
  </View>
);

export const PlayerComponent = ({
  screenX,
  y,
  width,
  height,
}: {
  screenX: number;
  y: number;
  width: number;
  height: number;
}) => (
  <View
    style={[
      styles.player,
      {
        left: screenX,
        top: y,
        width,
        height,
      },
    ]}
  >
    <View style={styles.playerHelmet} />
    <View style={styles.playerBody} />
    <View style={styles.playerLegLeft} />
    <View style={styles.playerLegRight} />
  </View>
);

export const BuildingComponent = ({ building }: { building: BuildingData }) => {
  return (
    <View
      style={[
        styles.building,
        {
          left: building.screenX,
          top: building.y,
          width: building.width,
          height: building.height,
        },
      ]}
    >
      <LinearGradient
        colors={[building.colors.main, building.colors.accent]}
        style={[styles.buildingBody, { borderColor: building.colors.accent }]}
      >
        {building.windowPattern.map((row, rowIdx) => (
          <View
            key={rowIdx}
            style={[
              styles.windowRow,
              {
                top: 10 + rowIdx * 35,
                left: '10%',
                width: '80%',
              },
            ]}
          >
            {row.map((isLit, colIdx) => (
              <View
                key={colIdx}
                style={[
                  styles.window,
                  {
                    width: 16,
                    height: 20,
                    backgroundColor: isLit ? building.colors.window : building.colors.accent,
                    borderWidth: 2,
                    borderColor: building.colors.accent,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </LinearGradient>

      <View
        style={[
          styles.roof,
          {
            top: GameTheme.dimensions.roofOffsetY,
            left: -8,
            width: building.width + 16,
            height: GameTheme.dimensions.roofHeight,
            borderColor: building.colors.accent,
          },
        ]}
      >
        <LinearGradient
          colors={[building.colors.roof, building.colors.accent]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
};

export const ProjectileComponent = ({ projectile }: { projectile: ProjectileData }) => {
  const renderProjectile = () => {
    switch (projectile.type) {
      case 'piano':
        return (
          <View style={styles.piano}>
            <View style={styles.pianoBody} />
            <View style={styles.pianoKeys} />
            <View style={[styles.pianoLeg, { left: 5 }]} />
            <View style={[styles.pianoLeg, { right: 5 }]} />
          </View>
        );
      case 'anvil':
        return (
          <View style={styles.anvil}>
            <View style={styles.anvilTop} />
            <View style={styles.anvilBody} />
            <View style={styles.anvilBottom} />
          </View>
        );
      case 'pizza':
        return (
          <View style={styles.pizza}>
            <View style={styles.pizzaCrust} />
            <View style={[styles.pepperoni, { top: 8, left: 10 }]} />
            <View style={[styles.pepperoni, { top: 15, left: 18 }]} />
            <View style={[styles.pepperoni, { top: 20, left: 8 }]} />
          </View>
        );
      case 'rat':
        return (
          <View style={styles.rat}>
            <View style={styles.ratBody} />
            <View style={styles.ratHead} />
            <View style={styles.ratTail} />
          </View>
        );
      case 'needle':
        return (
          <View style={styles.needle}>
            <View style={styles.needlePoint} />
            <View style={styles.needleBody} />
            <View style={styles.needlePlunger} />
          </View>
        );
      case 'taxi':
        return (
          <View style={styles.taxi}>
            <View style={styles.taxiBody} />
            <View style={styles.taxiSign} />
            <View style={[styles.taxiWheel, { left: 8 }]} />
            <View style={[styles.taxiWheel, { right: 8 }]} />
          </View>
        );
      case 'brick':
        return (
          <View style={styles.brick}>
            <View style={styles.brickPattern} />
          </View>
        );
      default:
        return <View style={{ width: 30, height: 30, backgroundColor: '#999' }} />;
    }
  };

  return (
    <View
      style={[
        styles.projectile,
        {
          left: projectile.screenX,
          top: projectile.y,
          transform: [
            { translateX: -projectile.width / 2 },
            { translateY: -projectile.height / 2 },
            { rotate: `${projectile.rotation}deg` },
          ],
        },
      ]}
    >
      {renderProjectile()}
    </View>
  );
};

export const HUDComponent = ({
  score,
  jumpsAvailable,
  isGrounded,
}: {
  score: number;
  jumpsAvailable: number;
  isGrounded: boolean;
}) => (
  <View style={styles.hud}>
    <Text style={styles.scoreText}>{score}</Text>
    <Text style={styles.infoText}>J: {jumpsAvailable}</Text>
    <Text
      style={[
        styles.groundedIndicator,
        { color: isGrounded ? GameTheme.colors.groundedIndicator : GameTheme.colors.airborneIndicator },
      ]}
    >
      {isGrounded ? '●' : '○'}
    </Text>
  </View>
);

export const GameOverScreen = ({ score, onRestart }: { score: number; onRestart: () => void }) => (
  <View style={styles.gameOverContainer}>
    <Text style={styles.gameOverTitle}>WASTED</Text>
    <View style={styles.scoreContainer}>
      <Text style={styles.finalScore}>{score}</Text>
    </View>
    <TouchableOpacity style={styles.retryButton} onPress={onRestart}>
      <Text style={styles.retryButtonText}>RETRY</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  skyContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  cloud: {
    position: 'absolute',
    width: 80,
    height: 40,
    backgroundColor: GameTheme.colors.cloudWhite,
    borderRadius: 50,
  },
  player: {
    position: 'absolute',
    zIndex: 50,
    transform: [{ translateX: -15 }, { translateY: -25 }],
  },
  playerHelmet: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -9 }],
    width: 18,
    height: 18,
    backgroundColor: GameTheme.colors.playerHelmet,
    borderWidth: 3,
    borderColor: GameTheme.colors.playerHelmetBorder,
  },
  playerBody: {
    position: 'absolute',
    top: 18,
    left: '50%',
    transform: [{ translateX: -11 }],
    width: 22,
    height: 20,
    backgroundColor: GameTheme.colors.playerBody,
    borderWidth: 3,
    borderColor: GameTheme.colors.playerBodyBorder,
  },
  playerLegLeft: {
    position: 'absolute',
    bottom: 0,
    left: '28%',
    width: 7,
    height: 16,
    backgroundColor: GameTheme.colors.playerLegs,
    borderWidth: 2,
    borderColor: GameTheme.colors.playerLegsBorder,
  },
  playerLegRight: {
    position: 'absolute',
    bottom: 0,
    right: '28%',
    width: 7,
    height: 16,
    backgroundColor: GameTheme.colors.playerLegs,
    borderWidth: 2,
    borderColor: GameTheme.colors.playerLegsBorder,
  },
  building: {
    position: 'absolute',
    zIndex: 10,
  },
  buildingBody: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 3,
    overflow: 'hidden',
  },
  windowRow: {
    position: 'absolute',
    height: 25,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  window: {
    height: 20,
    borderWidth: 2,
  },
  roof: {
    position: 'absolute',
    borderWidth: 4,
    zIndex: 20,
    overflow: 'hidden',
  },
  projectile: {
    position: 'absolute',
    zIndex: 40,
  },
  piano: {
    width: 40,
    height: 35,
  },
  pianoBody: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#000',
  },
  pianoKeys: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    right: 2,
    height: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  pianoLeg: {
    position: 'absolute',
    bottom: 0,
    width: 3,
    height: 8,
    backgroundColor: '#1a1a1a',
  },
  anvil: {
    width: 30,
    height: 30,
  },
  anvilTop: {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '50%',
    height: 8,
    backgroundColor: '#4a4a4a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  anvilBody: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: '#5a5a5a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  anvilBottom: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    width: '80%',
    height: 6,
    backgroundColor: '#4a4a4a',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  pizza: {
    width: 35,
    height: 35,
  },
  pizzaCrust: {
    position: 'absolute',
    width: 35,
    height: 35,
    backgroundColor: '#ffcc66',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#d4a044',
  },
  pepperoni: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#cc3333',
    borderRadius: 3,
  },
  rat: {
    width: 25,
    height: 15,
  },
  ratBody: {
    position: 'absolute',
    left: 4,
    top: 2,
    width: 16,
    height: 12,
    backgroundColor: '#5a5a5a',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  ratHead: {
    position: 'absolute',
    left: 18,
    top: 4,
    width: 7,
    height: 8,
    backgroundColor: '#5a5a5a',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  ratTail: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 6,
    height: 2,
    backgroundColor: '#7a7a7a',
  },
  needle: {
    width: 20,
    height: 40,
  },
  needlePoint: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -2 }],
    width: 4,
    height: 8,
    backgroundColor: '#aaaaaa',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  needleBody: {
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: [{ translateX: -3 }],
    width: 6,
    height: 24,
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    borderWidth: 1,
    borderColor: '#888',
  },
  needlePlunger: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -4 }],
    width: 8,
    height: 8,
    backgroundColor: '#ff6666',
    borderWidth: 1,
    borderColor: '#cc4444',
  },
  taxi: {
    width: 45,
    height: 25,
  },
  taxiBody: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 45,
    height: 16,
    backgroundColor: '#ffcc00',
    borderWidth: 2,
    borderColor: '#cc9900',
    borderRadius: 2,
  },
  taxiSign: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -6 }],
    width: 12,
    height: 6,
    backgroundColor: '#ff3333',
    borderWidth: 1,
    borderColor: '#cc0000',
  },
  taxiWheel: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
  },
  brick: {
    width: 25,
    height: 15,
  },
  brickPattern: {
    width: 25,
    height: 15,
    backgroundColor: '#aa5533',
    borderWidth: 2,
    borderColor: '#884422',
  },
  hud: {
    position: 'absolute',
    top: GameTheme.spacing.lg,
    left: GameTheme.spacing.lg,
    zIndex: 200,
    backgroundColor: GameTheme.colors.hudBackground,
    padding: GameTheme.spacing.md,
    borderWidth: 3,
    borderColor: GameTheme.colors.hudBorder,
  },
  scoreText: {
    color: GameTheme.colors.scoreText,
    fontSize: GameTheme.typography.fontSize.medium,
    marginBottom: GameTheme.spacing.xs,
  },
  infoText: {
    color: GameTheme.colors.infoText,
    fontSize: GameTheme.typography.fontSize.small,
  },
  groundedIndicator: {
    fontSize: GameTheme.typography.fontSize.medium,
    marginTop: GameTheme.spacing.xs,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
  },
  gameOverTitle: {
    fontSize: GameTheme.typography.fontSize.xlarge,
    color: '#ff4444',
    marginBottom: GameTheme.spacing.xxxl,
  },
  scoreContainer: {
    backgroundColor: 'rgba(74,95,127,0.3)',
    borderWidth: 3,
    borderColor: '#4a5f7f',
    padding: GameTheme.spacing.xxl,
    marginBottom: GameTheme.spacing.xxxl,
  },
  finalScore: {
    fontSize: GameTheme.typography.fontSize.xxlarge,
    color: GameTheme.colors.scoreText,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: GameTheme.spacing.lg,
    paddingHorizontal: GameTheme.spacing.xl * 2,
    backgroundColor: '#00d4ff',
    borderWidth: 4,
    borderColor: '#0099cc',
  },
  retryButtonText: {
    fontSize: GameTheme.typography.fontSize.large,
    color: '#000',
    fontWeight: 'bold' as const,
  },
});
