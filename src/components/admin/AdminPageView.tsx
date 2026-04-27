'use client';

import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AdminContent } from "@/components/admin/layout/AdminShell";
import { AdminPageHeader } from "@/components/admin/layout/AdminPageHeader";
import { Button, Card, Col, Row, Space, Typography } from "antd";

type AdminPageViewProps = {
  userEmail: string;
};

export function AdminPageView({ userEmail }: AdminPageViewProps) {
  const quickLinks = [
    { title: "Content Admin", description: "Manage pages, shared sections, and settings.", href: "/admin/content" },
    { title: "Publish Center", description: "Review draft/publish queue before going live.", href: "/admin/publish" },
    { title: "Asset Manager", description: "Upload and organize images/videos used by CMS.", href: "/admin/assets" },
    { title: "Audit Log", description: "Trace who changed what and when.", href: "/admin/content/audit" },
  ] as const;

  return (
    <AdminContent maxWidth="880px">
      <AdminPageHeader
        title="Admin Workspace"
        description={`Signed in as ${userEmail}.`}
      />

      <Card>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Quick Actions
          </Typography.Title>
          <Space wrap>
            <Link href="/admin/content">
              <Button type="primary">Open Content Admin</Button>
            </Link>
            <Link href="/admin/publish">
              <Button>Open Publish Center</Button>
            </Link>
            <Link href="/admin/assets">
              <Button>Open Asset Manager</Button>
            </Link>
          </Space>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {quickLinks.map((item) => (
          <Col xs={24} sm={12} key={item.href}>
            <Card
              title={item.title}
              extra={<Link href={item.href}>Open</Link>}
              styles={{ body: { paddingTop: 8 } }}
            >
              <Typography.Text type="secondary">{item.description}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Card>
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Account
          </Typography.Title>
          <Typography.Text type="secondary">{userEmail}</Typography.Text>
          <div>
            <SignOutButton />
          </div>
        </Space>
      </Card>
    </AdminContent>
  );
}
