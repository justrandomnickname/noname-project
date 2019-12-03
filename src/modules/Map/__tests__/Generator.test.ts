import Generator from '@Map/assembly/Generator'
import { NumberOfPoints } from '@Map/interfaces/Generator'
import { Delaunay, Voronoi } from 'd3-delaunay'

describe('(GENERATOR) test MapGenerator', () => {
  const generator = new Generator({ type: 'mock', size: 'DEVELOP', height: 500, width: 500 })
  it('Map size should match contract', () => {
    generator.create()
    expect(generator.points).toHaveLength(NumberOfPoints.DEVELOP)
  })

  it('Points should be valid', () => {
    const samples = []
    for (let i = 0; i < 10; i++) {
      const sample = generator.points[Math.floor(Math.random() * NumberOfPoints.DEVELOP)]
      samples.push(sample)
    }

    samples.forEach(sample => {
      expect(Array.isArray(sample)).toBe(true)
      expect(sample.length).toBe(2)
      expect(sample[0] <= generator.width).toBe(true)
      expect(sample[1] <= generator.height).toBe(true)
    })
  })

  it("Should be DELAUNAY'ed", () => {
    const delaunay = Delaunay.from(generator.points)
    const voronoi = delaunay.voronoi([0, 0, NumberOfPoints.DEVELOP, NumberOfPoints.DEVELOP])
    expect(delaunay).toBeInstanceOf(Delaunay)
    expect(voronoi).toBeInstanceOf(Voronoi)
  })

  it('Voronoi should be valid', () => {
    const delaunay = Delaunay.from(generator.points)
    const voronoi = delaunay.voronoi([0, 0, generator.height, generator.width])

    const samples: number[][][] = []

    for (let i = 0; i < 30; i++) {
      const index = Math.floor(Math.random() * NumberOfPoints.DEVELOP)
      const sample = voronoi.cellPolygon(index)
      samples.push(sample)
    }

    for (let i = 0; i < samples.length; i++) {
      expect(Array.isArray(samples[i])).toBe(true)
      for (let j = 0; j < samples[i].length; j++) {
        expect(Array.isArray(samples[i][j])).toBe(true)
        for (let k = 0; k < samples[i][j].length; k++) {
          expect(Number.isInteger(Math.floor(samples[i][j][k]))).toBe(true)
        }
      }
    }
  })

  it('Polygons should be created and relaxed', () => {
    expect(generator.polygons.length).toBe(0)
    const notRelaxed = [...generator.points]
    generator.createVoronoiAndLloydify({ iterations: 100 })
    expect(generator.polygons.length).toBeGreaterThan(0)
    expect(generator.polygons.length).toBe(NumberOfPoints.DEVELOP)
    const relaxed = generator.points

    expect(notRelaxed.length).toBe(relaxed.length)
    for (let i = 0; i < 30; i++) {
      const index = Math.floor(Math.random() * notRelaxed.length)
      expect(notRelaxed[index][0] === relaxed[index][0]).toBe(false)
    }
  })

  it('Polygons should have valid coords', () => {
    const delaunay = Delaunay.from(generator.points)
    const voronoi = delaunay.voronoi([0, 0, NumberOfPoints.DEVELOP, NumberOfPoints.DEVELOP])

    const samples = []

    for (let i = 0; i < 15; i++) {
      samples.push(generator.polygons[Math.floor(Math.random() * generator.polygons.length - 1)])
    }

    for (let i = 0; i < samples.length; i++) {
      expect(voronoi.contains(samples[i].index, samples[i].coords[0], samples[i].coords[1])).toBe(true)
      expect(delaunay.find(samples[i].coords[0], samples[i].coords[1]) === samples[i].index).toBe(true)
    }
  })

  it('Map should be with defined borders', () => {
    generator.defineBorders()
    let isHaveBorders = false
    for (let i = 0; i < generator.polygons.length; i++) {
      if (!isHaveBorders) {
        isHaveBorders = generator.polygons[i].type === 'CORNER'
      }
    }

    expect(isHaveBorders).toBe(true)
  })
})
