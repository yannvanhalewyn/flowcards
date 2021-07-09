import { useRecoilTransactionObserver_UNSTABLE } from "recoil";
import { map, join, prop } from "ramda";

/*
 * A logger for in development logging every state change. Intentionally left on
 * for production builds for easy introspection.
 *
 * Recoil's abstraction makes it hard to show all state, since Selectors and
 * Atoms are all complected in this node generator pattern, you either see them
 * all or none. For now, only show the ones that have changed.
 */
export const DevLogger = () => {
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    const changed = snapshot.getNodes_UNSTABLE({ isModified: true });

    // Nodes are a strange kind generators pattern. They can only be used in for
    // loops, and can only be iterated once.
    let nodes = [];
    for (let node of changed) {
      nodes.push(node);
    }

    const groupName = `%c CHANGES`;
    const nodeKeys = map(prop("key"), nodes);

    console.groupCollapsed(
      groupName,
      "color: #F59E0B; font-weight: bold",
      join(", ", nodeKeys)
    );

    nodes.forEach((node) => {
      const value = snapshot.getLoadable(node).contents;
      console.info(
        `%c ${node.key}`,
        "color: #EF4444; font-weight: bold",
        value
      );
    });

    console.groupEnd(groupName);
  });
  return null;
};
