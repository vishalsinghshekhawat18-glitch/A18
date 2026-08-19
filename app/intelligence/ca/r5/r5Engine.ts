/**
 * R5 General Current Affairs Intelligence Engine Core Pipeline
 * Ingestion -> Claim Extraction -> Story Identification -> Temporal & Conflict Resolution -> Knowledge Synthesis
 */

import { SourceRecord, ExtractedClaim, Story, KnowledgeNode, SourceConflict } from './types';
import { extractClaimsFromSource, detectSourceConflicts } from './claimExtractor';

export class R5CurrentAffairsEngine {
  private existingKnowledgeGraph: Map<string, KnowledgeNode> = new Map();

  constructor(initialNodes: KnowledgeNode[] = []) {
    initialNodes.forEach(node => {
      this.existingKnowledgeGraph.set(node.nodeId, node);
    });
  }

  public processSourceBatch(sources: SourceRecord[]): {
    extractedClaims: ExtractedClaim[];
    storiesIdentified: Story[];
    knowledgeNodes: KnowledgeNode[];
    conflictsDetected: SourceConflict[];
  } {
    // 1. Claim Extraction across all incoming sources
    const allClaims: ExtractedClaim[] = [];
    sources.forEach(src => {
      const claims = extractClaimsFromSource(src);
      allClaims.push(...claims);
    });

    // 2. Story Clustering & Identification
    const stories: Story[] = [];
    const conflicts: SourceConflict[] = [];

    allClaims.forEach(claim => {
      const text = claim.rawSnippet.toLowerCase();

      // Check if this claim belongs to an existing story in this batch or existing knowledge graph
      let matchedStory = stories.find(s => {
        const sText = s.canonicalTitle.toLowerCase();
        return s.entities.includes(claim.normalizedEntity) && 
               (text.includes(s.canonicalTitle.substring(0, 15).toLowerCase()) || sText.includes(claim.rawSnippet.substring(0, 15).toLowerCase()));
      });

      if (matchedStory) {
        // Check for conflicts with existing claims in story
        matchedStory.claims.forEach(c => {
          const conf = detectSourceConflicts(c, claim);
          if (conf) {
            conflicts.push(conf);
            matchedStory!.conflicts.push(conf);
          }
        });
        matchedStory.claims.push(claim);
        if (!matchedStory.sourceIds.includes(claim.sourceId)) {
          matchedStory.sourceIds.push(claim.sourceId);
        }
      } else {
        // Create new story cluster
        const studyUtilityScore = 
          claim.category === 'REGULATORY' ? 95 :
          claim.category === 'MACRO' ? 92 :
          claim.category === 'BANKING' ? 88 :
          claim.category === 'SCHEME' ? 86 :
          claim.category === 'APPOINTMENT' || claim.category === 'INDEX' ? 82 :
          claim.category === 'DEFENCE' || (claim.category === 'SPORTS' && text.includes('world cup')) ? 80 : 30;

        const isAmendment = text.includes('amendment') || text.includes('clarification') || text.includes('modifies');
        const isImplementation = text.includes('launches phase') || text.includes('assents') || text.includes('operationalised');

        const newStory: Story = {
          storyId: `story-${claim.claimId}`,
          canonicalTitle: claim.rawSnippet.split('\n')[0].substring(0, 90),
          entities: [claim.normalizedEntity],
          claims: [claim],
          sourceIds: [claim.sourceId],
          temporalPhase: isAmendment ? 'AMENDMENT' : isImplementation ? 'IMPLEMENTATION' : 'ANNOUNCEMENT',
          conflicts: [],
          studyUtilityScore
        };
        stories.push(newStory);
      }
    });

    // 3. Knowledge Node Synthesis (Mapping Stories -> Knowledge Nodes)
    const knowledgeNodes: KnowledgeNode[] = [];

    stories.forEach(story => {
      // Opportunity Cost Filter
      if (story.studyUtilityScore < 75) {
        knowledgeNodes.push({
          nodeId: `node-${story.storyId}`,
          title: story.canonicalTitle,
          category: 'SEC4',
          tier: 'SKIP',
          qualityState: 'SKIPPED',
          summary: 'Skipped low-yield source development (Opportunity cost test failed).',
          keyFacts: [],
          provenanceSources: story.sourceIds,
          storyId: story.storyId,
          absorbedFacts: [],
          relationships: []
        });
        return;
      }

      // Check if an existing node in graph matches
      let existingNode = Array.from(this.existingKnowledgeGraph.values()).find(n => {
        return n.title.toLowerCase().includes(story.canonicalTitle.substring(0, 20).toLowerCase());
      });

      if (existingNode) {
        // Chronological Update or Merged Fact
        if (story.temporalPhase === 'IMPLEMENTATION' || story.temporalPhase === 'AMENDMENT') {
          knowledgeNodes.push({
            nodeId: `update-${story.storyId}`,
            title: `🔄 UPDATE: ${story.canonicalTitle}`,
            category: existingNode.category,
            tier: 'UPDATE',
            qualityState: 'UPDATE',
            summary: `Incremental update linked to baseline node [${existingNode.title}](${existingNode.nodeId})`,
            keyFacts: story.claims.map(c => c.rawSnippet),
            provenanceSources: story.sourceIds,
            storyId: story.storyId,
            parentStoryId: existingNode.nodeId,
            absorbedFacts: [],
            relationships: [{ targetNodeId: existingNode.nodeId, type: 'CHRONOLOGICAL_UPDATE', reason: 'Later implementation/amendment milestone' }]
          });
        } else {
          // Exact duplicate across sources
          knowledgeNodes.push({
            nodeId: `redir-${story.storyId}`,
            title: story.canonicalTitle,
            category: existingNode.category,
            tier: 'REDIRECT',
            qualityState: 'DUPLICATE',
            summary: `Redirect to master canonical note [${existingNode.title}](${existingNode.nodeId})`,
            keyFacts: [],
            provenanceSources: story.sourceIds,
            storyId: story.storyId,
            redirectTargetId: existingNode.nodeId,
            absorbedFacts: story.claims.map(c => c.rawSnippet),
            relationships: [{ targetNodeId: existingNode.nodeId, type: 'REDIRECT_DUPLICATE', reason: 'Duplicate coverage from secondary source' }]
          });
        }
        return;
      }

      // Standalone High-Yield Knowledge Node
      const isTierA = story.studyUtilityScore >= 85;
      const section = 
        story.claims[0].category === 'REGULATORY' ? 'SEC2' :
        story.claims[0].category === 'MACRO' ? 'SEC1' :
        story.claims[0].category === 'BANKING' ? 'SEC3' :
        story.claims[0].category === 'SCHEME' ? 'SEC10' :
        story.claims[0].category === 'APPOINTMENT' ? 'SEC5' :
        story.claims[0].category === 'INDEX' ? 'SEC7' :
        story.claims[0].category === 'SPORTS' ? 'SEC8' : 'SEC6';

      const node: KnowledgeNode = {
        nodeId: `node-${story.storyId}`,
        title: story.canonicalTitle,
        category: section,
        tier: isTierA ? 'TIER_A' : 'TIER_B_PLUS',
        qualityState: story.conflicts.length > 0 ? 'SOURCE_CONFLICT' : 'VALID',
        summary: story.claims[0].rawSnippet,
        keyFacts: story.claims.map(c => c.rawSnippet),
        staticGK: isTierA ? {
          anchorEntity: story.entities[0],
          details: `Statutory sovereign authority or framework anchor for ${story.entities[0]}`
        } : undefined,
        examAngle: `🎯 Exam Angle → Focus on exact figures, statutory frameworks, and operational thresholds.`,
        provenanceSources: story.sourceIds,
        storyId: story.storyId,
        absorbedFacts: [],
        relationships: []
      };

      knowledgeNodes.push(node);
      this.existingKnowledgeGraph.set(node.nodeId, node);
    });

    return {
      extractedClaims: allClaims,
      storiesIdentified: stories,
      knowledgeNodes,
      conflictsDetected: conflicts
    };
  }
}
